import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import PageTitle from "$components/PageTitle.tsx";
import {
  useSessionInfo,
  useCollection,
  useSaveCollectionItem,
  useDeleteCollectionItem,
} from "$functions/query.ts";
import { CollectionForbiddenError } from "$functions/backend.ts";
import "./fotos.scss";

// Backend collection holding the cards, one row per card. Every member may
// read it; FOCUS (and admins) may save and delete cards. The backend enforces
// this from COLLECTIONS in dodeka/backend/.../data/features/committee_collections.py;
// FOTOS_WRITE_ROLE only decides whether the editor is shown. Keep them in sync.
const FOTOS_COLLECTION = "fotos";
const FOTOS_WRITE_ROLE = "focus";

const EVENT_TYPES = [
  "Wedstrijd",
  "Gezelligheid",
  "Training",
  "Reis",
  "Overig",
] as const;
type EventType = (typeof EVENT_TYPES)[number];
const MAX_TYPES = 3;

// "Nieuw!" shows by itself: a card added in the last 14 days, for an event
// from the last 60 days (so importing old albums doesn't mark them all new).
const NEW_FOR_DAYS = 14;
const NEW_ONLY_FOR_EVENTS_WITHIN_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

// Standard link names shown in the create form; extra names can be added there.
// The stored label stays the short key; LINK_INFO decides how it's shown.
const DEFAULT_LINK_LABELS = ["dodeka", "dump", "alles", "focus"];

const UPLOAD_LABEL = "dump";

const LINK_INFO: Record<string, { naam: string; hint: string }> = {
  dodeka: { naam: "Beeldmateriaal", hint: "De foto's en video's van dit evenement" },
  dump: { naam: "Upload je beeldmateriaal", hint: "Map waar leden zelf foto's en video's in zetten" },
  alles: { naam: "Alle foto's", hint: "Alles wat er geschoten is" },
  focus: { naam: "Selectie", hint: "De beste foto's" },
};

function linkNaam(label: string): string {
  return LINK_INFO[label]?.naam ?? label;
}

interface PhotoLink {
  label: string;
  url: string;
}

// Mirrors validate_foto_card in dodeka/backend/.../data/features/fotos.py
interface PhotoEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD, the (first) day of the event
  end_date?: string; // YYYY-MM-DD, for events spanning several days
  types: EventType[]; // 1-3, e.g. Wedstrijd + Gezelligheid
  in_progress?: boolean; // "Wordt aan gewerkt": FOCUS is still editing
  seizoen?: string; // e.g. "25/26"; overrides the season derived from the date
  image?: string; // data URL, resized on upload; a placeholder shows when missing
  links: PhotoLink[];
  created_at?: number; // unix seconds, set by the backend
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// "14 juni 2026", "13 – 14 juni 2026", "30 januari – 7 februari 2026"
function formatDateRange(start: string, end?: string): string {
  if (!end || end === start) return formatDate(start);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  const sameMonth = sameYear && start.slice(5, 7) === end.slice(5, 7);
  const first = new Date(start).toLocaleDateString("nl-NL", {
    day: "numeric",
    ...(sameMonth ? {} : { month: "long" }),
    ...(sameYear ? {} : { year: "numeric" }),
  });
  return `${first} – ${formatDate(end)}`;
}

function isNew(event: PhotoEvent, now = Date.now()): boolean {
  if (!event.created_at) return false;
  const addedRecently = now - event.created_at * 1000 < NEW_FOR_DAYS * DAY_MS;
  const eventEnd = new Date(event.end_date ?? event.date).getTime();
  const recentEvent = now - eventEnd < NEW_ONLY_FOR_EVENTS_WITHIN_DAYS * DAY_MS;
  return addedRecently && recentEvent;
}

function TypeBadges({ types }: { types: EventType[] }) {
  return (
    <>
      {types.map((t) => (
        <span key={t} className={`fotos-badge fotos-badge--${typeSlug(t)}`}>
          {t}
        </span>
      ))}
    </>
  );
}

function StatusLabels({ event }: { event: PhotoEvent }) {
  const nieuw = isNew(event);
  if (!nieuw && !event.in_progress) return null;
  return (
    <span className="fotos-labels">
      {nieuw && <span className="fotos-label fotos-label--nieuw">Nieuw!</span>}
      {event.in_progress && (
        <span className="fotos-label fotos-label--bezig">Wordt aan gewerkt</span>
      )}
    </span>
  );
}

// Resize uploaded photos so the KV store stays small
function readAndResizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas niet beschikbaar"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("Kon afbeelding niet laden"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Kon bestand niet lezen"));
    reader.readAsDataURL(file);
  });
}

// The club runs on the academic year: September through August
function seasonOf(dateStr: string): string {
  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(5, 7));
  const start = month >= 9 ? year : year - 1;
  const yy = (n: number) => String(n % 100).padStart(2, "0");
  return `${yy(start)}/${yy(start + 1)}`;
}

function eventSeason(event: PhotoEvent): string {
  return event.seizoen ?? seasonOf(event.date);
}

// Seasons to offer in the form: a few around the event's date (or today)
function seasonOptions(dateStr: string, current: string): string[] {
  const base = dateStr ? seasonOf(dateStr) : seasonOf(new Date().toISOString().slice(0, 10));
  const startYear = 2000 + Number(base.slice(0, 2));
  const yy = (n: number) => String(n % 100).padStart(2, "0");
  const options = [];
  for (let y = startYear + 1; y >= startYear - 3; y--) options.push(`${yy(y)}/${yy(y + 1)}`);
  if (current && !options.includes(current)) options.push(current);
  return options;
}

function typeSlug(type: EventType): string {
  return type.toLowerCase();
}

// The event's photo, or a placeholder in its type colour when there is none
function EventImage({
  name,
  type,
  image,
  className,
  lazy,
}: {
  name: string;
  type: EventType;
  image?: string | null | undefined;
  className?: string;
  lazy?: boolean;
}) {
  if (image) {
    return <img src={image} alt="" className={className} loading={lazy ? "lazy" : undefined} />;
  }
  return (
    <div className={`fotos-placeholder fotos-placeholder--${typeSlug(type)} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
      <span lang="nl">{name || "Nieuw evenement"}</span>
    </div>
  );
}

// --- Dutch date field (dd-mm-jjjj) ---
// A native <input type="date"> shows the browser's locale (mm/dd/yyyy on an
// English Mac), so we type dates as text and keep a native picker as a helper.

function isoToDutch(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

function dutchToIso(text: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text);
  if (!m) return null;
  const [, d, mo, y] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  const valid =
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(mo) - 1 &&
    date.getDate() === Number(d);
  return valid ? `${y}-${mo}-${d}` : null;
}

// Formats while typing: digits get dashes, and "4/10" becomes "04-10"
function formatTypedDate(raw: string): string {
  const parts = raw.split(/[^0-9]+/);
  let digits = "";
  parts.forEach((part, i) => {
    const followedBySeparator = i < parts.length - 1;
    digits += i < 2 && followedBySeparator && part.length === 1 ? `0${part}` : part;
  });
  digits = digits.slice(0, 8);
  let out = digits.slice(0, 2);
  if (digits.length > 2) out += `-${digits.slice(2, 4)}`;
  if (digits.length > 4) out += `-${digits.slice(4)}`;
  if (/[^0-9]$/.test(raw) && (digits.length === 2 || digits.length === 4)) out += "-";
  return out;
}

function DateInput({
  value,
  onChange,
}: {
  value: string; // yyyy-mm-dd, or "" while incomplete/invalid
  onChange: (iso: string) => void;
}) {
  const [text, setText] = useState(() => isoToDutch(value));
  const pickerRef = useRef<HTMLInputElement>(null);
  const complete = text.length === 10;
  const invalid = complete && dutchToIso(text) === null;

  const update = (next: string) => {
    setText(next);
    onChange(dutchToIso(next) ?? "");
  };

  return (
    <div className="fotos-date">
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="dd-mm-jjjj"
        maxLength={10}
        value={text}
        aria-invalid={invalid}
        onChange={(e) => update(formatTypedDate(e.target.value))}
      />
      <button
        type="button"
        className="fotos-date-kalender"
        aria-label="Kies een datum in de kalender"
        onClick={() => {
          const picker = pickerRef.current;
          if (!picker) return;
          picker.value = dutchToIso(text) ?? "";
          if (typeof picker.showPicker === "function") picker.showPicker();
          else picker.focus();
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      </button>
      <input
        ref={pickerRef}
        type="date"
        className="fotos-date-native"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => update(isoToDutch(e.target.value))}
      />
      {invalid && <span className="fotos-date-fout">Deze datum bestaat niet</span>}
    </div>
  );
}

// Close on Escape and keep the page behind the overlay from scrolling
function useOverlay(onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}

function LinksModal({
  event,
  onClose,
}: {
  event: PhotoEvent;
  onClose: () => void;
}) {
  useOverlay(onClose);
  const bekijken = event.links.filter((l) => l.label !== UPLOAD_LABEL);
  const upload = event.links.find((l) => l.label === UPLOAD_LABEL);

  return (
    <div className="fotos-overlay" onClick={onClose}>
      <div
        className="fotos-modal fotos-modal--sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fotos-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <EventImage name={event.name} type={event.types[0] ?? "Overig"} image={event.image} className="fotos-modal-image" />
        <button className="fotos-modal-close" onClick={onClose} aria-label="Sluiten" autoFocus>
          ×
        </button>
        <div className="fotos-modal-body">
          <p className="fotos-modal-meta">
            <TypeBadges types={event.types} />
            {formatDateRange(event.date, event.end_date)}
          </p>
          <StatusLabels event={event} />
          <h2 className="fotos-modal-title" id="fotos-modal-title">
            {event.name}
          </h2>

          {bekijken.length === 0 && !upload && (
            <p className="fotos-modal-empty">
              Er staat nog geen beeldmateriaal online voor dit evenement.
            </p>
          )}

          {bekijken.length > 0 && (
            <div className="fotos-modal-links">
              {bekijken.map((link, i) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`fotos-link ${i === 0 ? "fotos-link--primary" : ""}`}
                >
                  {linkNaam(link.label)}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}

          {upload && (
            <div className="fotos-upload">
              <p className="fotos-upload-title">Zelf foto's of video's gemaakt?</p>
              <p className="fotos-upload-text">
                Zet ze in de gedeelde map, dan komen ze bij het beeldmateriaal
                van dit evenement.
              </p>
              <a
                href={upload.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fotos-link fotos-link--upload"
              >
                Upload je beeldmateriaal
                <span aria-hidden="true">↑</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface LinkRow {
  label: string;
  url: string;
  custom: boolean;
}

function eventToLinkRows(event: PhotoEvent | null): LinkRow[] {
  const rows: LinkRow[] = DEFAULT_LINK_LABELS.map((label) => ({
    label,
    url: event?.links.find((l) => l.label === label)?.url ?? "",
    custom: false,
  }));
  for (const link of event?.links ?? []) {
    if (!DEFAULT_LINK_LABELS.includes(link.label)) {
      rows.push({ label: link.label, url: link.url, custom: true });
    }
  }
  return rows;
}

function EditModal({
  existing,
  saving,
  error,
  onSave,
  onDelete,
  onClose,
}: {
  existing: PhotoEvent | null;
  saving: boolean;
  error: string | null;
  onSave: (event: PhotoEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? "");
  const [date, setDate] = useState(existing?.date ?? "");
  // "" means a one-day event
  const [endDate, setEndDate] = useState(existing?.end_date ?? "");
  const [types, setTypes] = useState<EventType[]>(existing?.types ?? ["Overig"]);
  const [inProgress, setInProgress] = useState(existing?.in_progress ?? false);
  // "" means automatic: the season follows from the date
  const [seizoen, setSeizoen] = useState(existing?.seizoen ?? "");
  const [image, setImage] = useState<string | null>(existing?.image ?? null);
  const [linkRows, setLinkRows] = useState<LinkRow[]>(() =>
    eventToLinkRows(existing),
  );
  const [formError, setFormError] = useState<string | null>(null);
  useOverlay(onClose);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setImage(await readAndResizeImage(file));
      setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Upload mislukt");
    }
  };

  const updateRow = (index: number, patch: Partial<LinkRow>) => {
    setLinkRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      setFormError("Vul een naam en een geldige datum (dd-mm-jjjj) in.");
      return;
    }
    if (endDate && endDate < date) {
      setFormError("De einddatum kan niet voor de begindatum liggen.");
      return;
    }
    if (types.length === 0) {
      setFormError("Kies minstens één soort evenement.");
      return;
    }
    const links = linkRows
      .filter((row) => row.label.trim() && row.url.trim())
      .map((row) => ({ label: row.label.trim(), url: row.url.trim() }));
    onSave({
      id: existing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      date,
      ...(endDate && endDate !== date ? { end_date: endDate } : {}),
      types,
      ...(inProgress ? { in_progress: true } : {}),
      ...(seizoen ? { seizoen } : {}),
      ...(image ? { image } : {}),
      links,
    });
  };

  return (
    <div className="fotos-overlay" onClick={onClose}>
      <div
        className="fotos-modal fotos-modal--form"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="fotos-modal-close" onClick={onClose} aria-label="Sluiten">
          ×
        </button>
        <h2 className="fotos-modal-title">
          {existing ? "Kaart bewerken" : "Nieuwe kaart"}
        </h2>
        <form className="fotos-form" onSubmit={handleSubmit}>
          <label className="fotos-form-label">
            Foto <span className="fotos-form-optioneel">(optioneel)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <EventImage name={name} type={types[0] ?? "Overig"} image={image} className="fotos-form-preview" />
          {image ? (
            <button type="button" className="fotos-form-addlink" onClick={() => setImage(null)}>
              Foto weghalen
            </button>
          ) : (
            <p className="fotos-form-hint">
              Zonder foto krijgt de kaart deze placeholder. Je kunt later altijd
              een foto toevoegen.
            </p>
          )}
          <label className="fotos-form-label">
            Naam evenement
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. NSK Baan"
            />
          </label>
          <label className="fotos-form-label">
            Datum
            <DateInput value={date} onChange={setDate} />
          </label>
          <label className="fotos-form-label">
            <span>
              Einddatum <span className="fotos-form-optioneel">(optioneel)</span>
            </span>
            <DateInput value={endDate} onChange={setEndDate} />
            <span className="fotos-form-hint">
              Alleen voor evenementen van meerdere dagen, zoals een trainingsweekend.
            </span>
          </label>
          <label className="fotos-form-label">
            Seizoen
            <select value={seizoen} onChange={(e) => setSeizoen(e.target.value)}>
              <option value="">
                Automatisch{date ? ` (${seasonOf(date)})` : " (volgt uit de datum)"}
              </option>
              {seasonOptions(date, seizoen).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="fotos-form-hint">
              Het seizoen loopt van september tot en met augustus. Kies zelf een
              seizoen als het evenement daar beter bij hoort.
            </span>
          </label>
          <fieldset className="fotos-form-label fotos-form-types">
            <legend>Soort evenement</legend>
            <div className="fotos-form-typechips">
              {EVENT_TYPES.map((t) => {
                const checked = types.includes(t);
                const full = !checked && types.length >= MAX_TYPES;
                return (
                  <label
                    key={t}
                    className={`fotos-chip fotos-chip--klein ${checked ? "fotos-chip--active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={full}
                      onChange={() =>
                        setTypes((current) =>
                          checked
                            ? current.filter((x) => x !== t)
                            : EVENT_TYPES.filter((x) => x === t || current.includes(x)),
                        )
                      }
                    />
                    {t}
                  </label>
                );
              })}
            </div>
            <span className="fotos-form-hint">Kies er één tot drie.</span>
          </fieldset>
          <label className="fotos-form-check">
            <input
              type="checkbox"
              checked={inProgress}
              onChange={(e) => setInProgress(e.target.checked)}
            />
            <span>
              Wordt aan gewerkt
              <span className="fotos-form-hint">
                FOCUS is de foto's nog aan het bewerken. Leden zien dit op de kaart.
              </span>
            </span>
          </label>

          <p className="fotos-form-section">Links (alleen ingevulde links worden getoond)</p>
          {linkRows.map((row, i) => (
            <div className="fotos-form-linkrow" key={i}>
              {row.custom ? (
                <input
                  type="text"
                  className="fotos-form-linklabel"
                  value={row.label}
                  placeholder="naam"
                  onChange={(e) => updateRow(i, { label: e.target.value })}
                />
              ) : (
                <span className="fotos-form-linklabel" title={LINK_INFO[row.label]?.hint}>
                  {linkNaam(row.label)}
                </span>
              )}
              <input
                type="url"
                value={row.url}
                placeholder="https://..."
                onChange={(e) => updateRow(i, { url: e.target.value })}
              />
              {row.custom && (
                <button
                  type="button"
                  className="fotos-form-linkremove"
                  aria-label="Link verwijderen"
                  onClick={() =>
                    setLinkRows((rows) => rows.filter((_, j) => j !== i))
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="fotos-form-addlink"
            onClick={() =>
              setLinkRows((rows) => [
                ...rows,
                { label: "", url: "", custom: true },
              ])
            }
          >
            + Link toevoegen
          </button>

          {(formError ?? error) && (
            <p className="fotos-form-error">{formError ?? error}</p>
          )}

          <div className="fotos-form-actions">
            <button type="submit" className="fotos-button" disabled={saving}>
              {saving ? "Opslaan..." : "Klaar"}
            </button>
            {existing && (
              <button
                type="button"
                className="fotos-button fotos-button--danger"
                disabled={saving}
                onClick={() => onDelete(existing.id)}
              >
                Verwijderen
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Fotos() {
  const { data: session, isLoading: sessionLoading } = useSessionInfo();
  const loggedIn = !!session;
  const isMember = session?.user.permissions.includes("member") ?? false;
  const isAdmin = session?.user.permissions.includes("admin") ?? false;
  const canEdit =
    isAdmin || (session?.user.permissions.includes(FOTOS_WRITE_ROLE) ?? false);

  const eventsQuery = useCollection<PhotoEvent>(FOTOS_COLLECTION, loggedIn && isMember);
  const saveCard = useSaveCollectionItem<PhotoEvent>(FOTOS_COLLECTION);
  const deleteCard = useDeleteCollectionItem(FOTOS_COLLECTION);
  const saving = saveCard.isPending || deleteCard.isPending;

  // Dev-only override to preview the editor/lid view regardless of the
  // session's permissions; null follows the real permissions. Has no effect
  // (and isn't rendered) outside of dev.
  const isDev = import.meta.env.DEV;
  const [devShowEditor, setDevShowEditor] = useState<boolean | null>(null);
  const showEditUi = isDev && devShowEditor !== null ? devShowEditor : canEdit;

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("alle");
  const [typeFilter, setTypeFilter] = useState<EventType | "alle">("alle");
  const [openEvent, setOpenEvent] = useState<PhotoEvent | null>(null);
  const [editState, setEditState] = useState<
    { open: false } | { open: true; event: PhotoEvent | null }
  >({ open: false });
  const [saveError, setSaveError] = useState<string | null>(null);

  const events: PhotoEvent[] = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);

  const seasons = useMemo(() => {
    const set = new Set(events.map(eventSeason));
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [events]);

  // Season + search narrow the list first, so the type chips can show counts
  const inSeasonAndSearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => yearFilter === "alle" || eventSeason(e) === yearFilter)
      .filter((e) => e.name.toLowerCase().includes(q));
  }, [events, yearFilter, search]);

  const typeCounts = useMemo(() => {
    const counts = new Map<EventType, number>();
    for (const e of inSeasonAndSearch) {
      for (const t of e.types) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return counts;
  }, [inSeasonAndSearch]);

  const visibleEvents = useMemo(() => {
    return inSeasonAndSearch
      .filter((e) => typeFilter === "alle" || e.types.includes(typeFilter))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [inSeasonAndSearch, typeFilter]);

  // Newest season first; events inside a season stay newest first
  const groups = useMemo(() => {
    const bySeason = new Map<string, PhotoEvent[]>();
    for (const e of visibleEvents) {
      const season = eventSeason(e);
      bySeason.set(season, [...(bySeason.get(season) ?? []), e]);
    }
    return [...bySeason.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [visibleEvents]);

  const filtersActive = search.trim() !== "" || yearFilter !== "alle" || typeFilter !== "alle";
  const resetFilters = () => {
    setSearch("");
    setYearFilter("alle");
    setTypeFilter("alle");
  };

  // Each save or delete touches one card only; the others stay as they are.
  const runEdit = async (edit: () => Promise<unknown>) => {
    setSaveError(null);
    try {
      await edit();
      setEditState({ open: false });
    } catch (e) {
      if (e instanceof CollectionForbiddenError) {
        setSaveError(
          "Je hebt geen rechten (meer) om het fotoboek aan te passen. Vraag een admin om je FOCUS-rechten te verlengen.",
        );
      } else {
        setSaveError(e instanceof Error ? e.message : "Opslaan mislukt");
      }
    }
  };

  if (sessionLoading) {
    return (
      <>
        <PageTitle title="Het Fotoboek" />
        <p className="fotos-status">Laden...</p>
      </>
    );
  }

  if (!loggedIn) {
    return (
      <>
        <PageTitle title="Het Fotoboek" />
        <p className="fotos-status">
          Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log
          in om deze pagina te kunnen bekijken.
        </p>
      </>
    );
  }

  if (!isMember) {
    return (
      <>
        <PageTitle title="Het Fotoboek" />
        <p className="fotos-status">
          Je hebt een actief lidmaatschap nodig om deze pagina te bekijken.
        </p>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Het Fotoboek" />
      <div className="fotos-container">
        <div className="fotos-toolbar">
          <div className="fotos-zoekrij">
            <input
              type="search"
              className="fotos-search"
              placeholder="Zoeken"
              aria-label="Zoek een evenement"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className={`fotos-select ${yearFilter !== "alle" ? "fotos-select--actief" : ""}`}
              aria-label="Seizoen"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="alle">Seizoen</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
            <select
              className={`fotos-select ${typeFilter !== "alle" ? "fotos-select--actief" : ""}`}
              aria-label="Soort evenement"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventType | "alle")}
            >
              <option value="alle">Soort</option>
              {EVENT_TYPES.filter((t) => typeCounts.has(t) || typeFilter === t).map((t) => (
                <option key={t} value={t}>
                  {t} ({typeCounts.get(t) ?? 0})
                </option>
              ))}
            </select>
          </div>
          {(isDev || showEditUi) && (
            <div className="fotos-adminrij">
              {isDev && (
                <div className="fotos-viewtoggle" role="group" aria-label="Bekijk als (alleen dev)">
                  <span>Dev: bekijk als</span>
                  <button
                    type="button"
                    className={`fotos-chip fotos-chip--klein ${showEditUi ? "fotos-chip--active" : ""}`}
                    onClick={() => setDevShowEditor(true)}
                  >
                    FOCUS
                  </button>
                  <button
                    type="button"
                    className={`fotos-chip fotos-chip--klein ${!showEditUi ? "fotos-chip--active" : ""}`}
                    onClick={() => setDevShowEditor(false)}
                  >
                    Lid
                  </button>
                </div>
              )}
              {showEditUi && (
                <button
                  className="fotos-button fotos-add"
                  onClick={() => {
                    setSaveError(null);
                    setEditState({ open: true, event: null });
                  }}
                >
                  + Nieuwe kaart
                </button>
              )}
            </div>
          )}
        </div>

        {eventsQuery.isLoading ? (
          <div className="fotos-grid" aria-busy="true" aria-label="Foto's laden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="fotos-card fotos-card--skeleton" />
            ))}
          </div>
        ) : eventsQuery.error ? (
          <p className="fotos-leeg">
            De foto's konden niet geladen worden. Probeer het later nog eens.
          </p>
        ) : events.length === 0 ? (
          <p className="fotos-leeg">
            Er staan nog geen fotoalbums online. Zodra er beeldmateriaal van een
            evenement is, vind je het hier.
          </p>
        ) : visibleEvents.length === 0 ? (
          <div className="fotos-leeg">
            <p>Geen evenementen gevonden met deze filters.</p>
            {filtersActive && (
              <button className="fotos-chip" onClick={resetFilters}>
                Filters wissen
              </button>
            )}
          </div>
        ) : (
          groups.map(([season, seasonEvents]) => (
            <section key={season} className="fotos-seizoen" aria-label={`Seizoen ${season}`}>
              <h2 className="fotos-seizoen-titel">
                Seizoen {season}
                <span>
                  {seasonEvents.length} {seasonEvents.length === 1 ? "evenement" : "evenementen"}
                </span>
              </h2>
              <div className="fotos-grid">
                {seasonEvents.map((event) => (
                  <div key={event.id} className="fotos-card">
                    <button
                      className="fotos-card-open"
                      onClick={() => setOpenEvent(event)}
                      aria-label={`${event.name}, ${formatDateRange(event.date, event.end_date)}`}
                    >
                      <div className="fotos-card-imagewrap">
                        <EventImage name={event.name} type={event.types[0] ?? "Overig"} image={event.image} lazy />
                        <span className="fotos-badges">
                          <TypeBadges types={event.types} />
                        </span>
                      </div>
                      <div className="fotos-card-info">
                        <h3 className="fotos-card-name" lang="nl">{event.name}</h3>
                        <p className="fotos-card-date">
                          {formatDateRange(event.date, event.end_date)}
                        </p>
                        <StatusLabels event={event} />
                      </div>
                    </button>
                    {showEditUi && (
                      <button
                        className="fotos-card-edit"
                        aria-label={`${event.name} bewerken`}
                        onClick={() => {
                          setSaveError(null);
                          setEditState({ open: true, event });
                        }}
                      >
                        ✎
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {openEvent && (
        <LinksModal event={openEvent} onClose={() => setOpenEvent(null)} />
      )}
      {editState.open && (
        <EditModal
          existing={editState.event}
          saving={saving}
          error={saveError}
          onClose={() => setEditState({ open: false })}
          onSave={(event) => {
            void runEdit(() => saveCard.mutateAsync(event));
          }}
          onDelete={(id) => {
            void runEdit(() => deleteCard.mutateAsync(id));
          }}
        />
      )}
    </>
  );
}
