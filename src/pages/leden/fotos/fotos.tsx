import { useMemo, useState, type FormEvent } from "react";
import PageTitle from "$components/PageTitle.tsx";
import {
  useSessionInfo,
  usePrivate,
  useAdminSetPrivate,
} from "$functions/query.ts";
import { PrivateKeyNotSetError } from "$functions/backend.ts";
import "./fotos.scss";

const FOTOS_KEY = "fotos_events";

const EVENT_TYPES = [
  "Wedstrijd",
  "Gezelligheid",
  "Training",
  "Reis",
  "Overig",
] as const;
type EventType = (typeof EVENT_TYPES)[number];

// Standard link names shown in the create form; extra names can be added there
const DEFAULT_LINK_LABELS = ["dump", "dodeka", "alles", "focus"];

interface PhotoLink {
  label: string;
  url: string;
}

interface PhotoEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  image: string; // data URL, resized on upload
  links: PhotoLink[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

function typeSlug(type: EventType): string {
  return type.toLowerCase();
}

function LinksModal({
  event,
  onClose,
}: {
  event: PhotoEvent;
  onClose: () => void;
}) {
  return (
    <div className="fotos-overlay" onClick={onClose}>
      <div className="fotos-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fotos-modal-close" onClick={onClose} aria-label="Sluiten">
          ×
        </button>
        <h2 className="fotos-modal-title">{event.name}</h2>
        <p className="fotos-modal-date">{formatDate(event.date)}</p>
        {event.links.length === 0 ? (
          <p className="fotos-modal-empty">
            Er zijn nog geen links voor dit evenement.
          </p>
        ) : (
          <div className="fotos-modal-links">
            {event.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fotos-modal-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
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
  const [type, setType] = useState<EventType>(existing?.type ?? "Overig");
  const [image, setImage] = useState<string | null>(existing?.image ?? null);
  const [linkRows, setLinkRows] = useState<LinkRow[]>(() =>
    eventToLinkRows(existing),
  );
  const [formError, setFormError] = useState<string | null>(null);

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
    if (!image) {
      setFormError("Upload eerst een foto.");
      return;
    }
    if (!name.trim() || !date) {
      setFormError("Vul een naam en datum in.");
      return;
    }
    const links = linkRows
      .filter((row) => row.label.trim() && row.url.trim())
      .map((row) => ({ label: row.label.trim(), url: row.url.trim() }));
    onSave({
      id: existing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      date,
      type,
      image,
      links,
    });
  };

  return (
    <div className="fotos-overlay" onClick={onClose}>
      <div
        className="fotos-modal fotos-modal--form"
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
            Foto
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          {image && (
            <img src={image} alt="" className="fotos-form-preview" />
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
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="fotos-form-label">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
                <span className="fotos-form-linklabel">{row.label}</span>
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

  const eventsQuery = usePrivate<PhotoEvent[]>(FOTOS_KEY, loggedIn && isMember);
  const setPrivate = useAdminSetPrivate();

  // Dev-only toggle to preview the admin/lid view without needing a real
  // admin session. Has no effect (and isn't rendered) outside of dev.
  const isDev = import.meta.env.DEV;
  const [devViewAsAdmin, setDevViewAsAdmin] = useState(false);
  const showAdminUi = isDev ? devViewAsAdmin : isAdmin;

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("alle");
  const [typeFilter, setTypeFilter] = useState<EventType | "alle">("alle");
  const [openEvent, setOpenEvent] = useState<PhotoEvent | null>(null);
  const [editState, setEditState] = useState<
    { open: false } | { open: true; event: PhotoEvent | null }
  >({ open: false });
  const [saveError, setSaveError] = useState<string | null>(null);

  const events: PhotoEvent[] = useMemo(() => {
    if (eventsQuery.error instanceof PrivateKeyNotSetError) return [];
    return eventsQuery.data ?? [];
  }, [eventsQuery.data, eventsQuery.error]);

  const years = useMemo(() => {
    const set = new Set(events.map((e) => e.date.slice(0, 4)));
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [events]);

  const visibleEvents = useMemo(() => {
    return events
      .filter((e) => yearFilter === "alle" || e.date.startsWith(yearFilter))
      .filter((e) => typeFilter === "alle" || e.type === typeFilter)
      .filter((e) =>
        e.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, yearFilter, typeFilter, search]);

  const saveEvents = async (next: PhotoEvent[]) => {
    setSaveError(null);
    try {
      await setPrivate.mutateAsync({
        key: FOTOS_KEY,
        value: next,
        role: "member",
      });
      setEditState({ open: false });
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Opslaan mislukt");
    }
  };

  if (sessionLoading) {
    return (
      <>
        <PageTitle title="Foto's" />
        <p className="fotos-status">Laden...</p>
      </>
    );
  }

  if (!loggedIn) {
    return (
      <>
        <PageTitle title="Foto's" />
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
        <PageTitle title="Foto's" />
        <p className="fotos-status">
          Je hebt een actief lidmaatschap nodig om deze pagina te bekijken.
        </p>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Foto's" />
      <div className="fotos-container">
        <div className="fotos-topbar">
          <input
            type="search"
            className="fotos-search"
            placeholder="Zoek een evenement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="fotos-select"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="alle">Alle jaren</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="fotos-typefilter">
            <button
              className={`fotos-chip ${typeFilter === "alle" ? "fotos-chip--active" : ""}`}
              onClick={() => setTypeFilter("alle")}
            >
              Alles
            </button>
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                className={`fotos-chip ${typeFilter === t ? "fotos-chip--active" : ""}`}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {isDev && (
            <div className="fotos-viewtoggle" role="group" aria-label="Bekijk als (alleen dev)">
              <button
                type="button"
                className={`fotos-chip ${devViewAsAdmin ? "fotos-chip--active" : ""}`}
                onClick={() => setDevViewAsAdmin(true)}
              >
                Admin
              </button>
              <button
                type="button"
                className={`fotos-chip ${!devViewAsAdmin ? "fotos-chip--active" : ""}`}
                onClick={() => setDevViewAsAdmin(false)}
              >
                Lid
              </button>
            </div>
          )}
          {showAdminUi && (
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

        {eventsQuery.isLoading ? (
          <p className="fotos-status">Foto's laden...</p>
        ) : eventsQuery.error &&
          !(eventsQuery.error instanceof PrivateKeyNotSetError) ? (
          <p className="fotos-status">Kon de foto's niet laden.</p>
        ) : visibleEvents.length === 0 ? (
          <p className="fotos-status">
            {events.length === 0
              ? "Er zijn nog geen fotokaarten."
              : "Geen evenementen gevonden met deze filters."}
          </p>
        ) : (
          <div className="fotos-grid">
            {visibleEvents.map((event) => (
              <button
                key={event.id}
                className="fotos-card"
                onClick={() => setOpenEvent(event)}
              >
                <div className="fotos-card-imagewrap">
                  <img src={event.image} alt={event.name} />
                  <span
                    className={`fotos-badge fotos-badge--${typeSlug(event.type)}`}
                  >
                    {event.type}
                  </span>
                  {showAdminUi && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="fotos-card-edit"
                      aria-label="Kaart bewerken"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSaveError(null);
                        setEditState({ open: true, event });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          setSaveError(null);
                          setEditState({ open: true, event });
                        }
                      }}
                    >
                      ✎
                    </span>
                  )}
                </div>
                <div className="fotos-card-info">
                  <h3 className="fotos-card-name">{event.name}</h3>
                  <p className="fotos-card-date">{formatDate(event.date)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openEvent && (
        <LinksModal event={openEvent} onClose={() => setOpenEvent(null)} />
      )}
      {editState.open && (
        <EditModal
          existing={editState.event}
          saving={setPrivate.isPending}
          error={saveError}
          onClose={() => setEditState({ open: false })}
          onSave={(event) => {
            const others = events.filter((e) => e.id !== event.id);
            void saveEvents([...others, event]);
          }}
          onDelete={(id) => {
            void saveEvents(events.filter((e) => e.id !== id));
          }}
        />
      )}
    </>
  );
}
