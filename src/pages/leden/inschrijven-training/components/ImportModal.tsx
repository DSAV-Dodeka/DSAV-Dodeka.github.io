import { useRef, useState } from "react";
import type {
  ImportedGroupSchedule,
  ImportedTraining,
  ScheduleSlot,
  TrainingDay,
} from "../types";
import {
  FIXED_SLOT_NAMES,
  formatDayMonth,
  formatWeekday,
  parseGroupScheduleFile,
  parseImportFile,
} from "../utils";
import "./ImportModal.scss";

// What is being imported: the full week schedule, or one group's schedules
// (a sprint trainer delivers all Sprint trainings, not the MiLa ones).
type ImportMode = "full" | ScheduleSlot;

const MODE_LABELS: { mode: ImportMode; label: string }[] = [
  { mode: "full", label: "Volledig schema" },
  { mode: "sprint", label: "Sprint" },
  { mode: "mila", label: "MiLa" },
  { mode: "loopgroep", label: "Loopgroep" },
];

const FULL_CSV_EXAMPLE = `date,sprint schedule,mila schedule,loopgroep schedule,t1 event,t2 event,available trainers,warm-up trainers
2026-07-06,"Kern: 3× 3×60m vliegend","6× 800m, rust 90\\"","40' duurloop D1/D2",Kogel,Discus,"Jasmijn, Karel, Roos, Sven, Nina",Jasmijn
2026-07-08,"4× starts uit blokken","8× 400m","35' duurloop",Ver,,"Karel, Roos, Jasmijn, Nina, Sven",Roos`;

const FULL_JSON_EXAMPLE = `[
  {
    "date": "2026-07-06",
    "sprint_schedule": "Kern: 3× 3×60m vliegend",
    "mila_schedule": "6× 800m, rust 90\\"",
    "loopgroep_schedule": "40' duurloop D1/D2",
    "t1_event": "Kogel",
    "t2_event": "Discus",
    "available_trainers": "Jasmijn, Karel, Roos, Sven, Nina",
    "warmup_trainers": "Jasmijn"
  }
]`;

const GROUP_CSV_EXAMPLE = `date,schedule
2026-07-06,"Kern: 3× 3×60m vliegend, rust 3'"
2026-07-08,"4× starts uit blokken + core"`;

const GROUP_JSON_EXAMPLE = `[
  { "date": "2026-07-06", "schedule": "Kern: 3× 3×60m vliegend" },
  { "date": "2026-07-08", "schedule": "4× starts uit blokken" }
]`;

interface ImportModalProps {
  trainings: TrainingDay[];
  onClose: () => void;
  // Full import: trainings to add + existing dates to overwrite.
  onImport: (trainings: ImportedTraining[], replaceDates: string[]) => void;
  // Per-group import: set one group's schedules; days that don't exist yet
  // are created, existing schedules only overwritten for replaceDates.
  onImportGroup: (
    slot: ScheduleSlot,
    items: ImportedGroupSchedule[],
    replaceDates: string[],
  ) => void;
}

export default function ImportModal(props: ImportModalProps) {
  const [mode, setMode] = useState<ImportMode>("full");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [error, setError] = useState<string | null>(null);
  const [parsedFull, setParsedFull] = useState<ImportedTraining[] | null>(
    null,
  );
  const [parsedGroup, setParsedGroup] = useState<
    ImportedGroupSchedule[] | null
  >(null);
  const [choices, setChoices] = useState<Record<string, "replace" | "keep">>(
    {},
  );
  const fileInput = useRef<HTMLInputElement>(null);

  const existingDates = props.trainings.map((t) => t.date);
  // A conflict needs a per-date decision: for the full import that's any
  // existing day; for a group import only days where that group already has
  // a schedule (empty schedules are filled in without asking).
  function isConflict(date: string): boolean {
    if (mode === "full") return existingDates.includes(date);
    const day = props.trainings.find((t) => t.date === date);
    if (!day) return false;
    return day.events.some(
      (event) => event.slot === mode && event.schedule !== null,
    );
  }

  const parsedDates =
    (mode === "full"
      ? parsedFull?.map((t) => t.date)
      : parsedGroup?.map((t) => t.date)) ?? [];
  const conflicts = parsedDates.filter(isConflict);
  const parsed = mode === "full" ? parsedFull : parsedGroup;

  async function handleFile(file: File) {
    setError(null);
    try {
      const content = await file.text();
      if (mode === "full") {
        const trainings = parseImportFile(file.name, content);
        if (trainings.length === 0) {
          setError("Geen trainingen gevonden in het bestand.");
          return;
        }
        setParsedFull(trainings);
        setChoices(
          Object.fromEntries(
            trainings
              .filter((t) => isConflict(t.date))
              .map((t) => [t.date, "keep" as const]),
          ),
        );
      } else {
        const items = parseGroupScheduleFile(file.name, content);
        if (items.length === 0) {
          setError("Geen schema's gevonden in het bestand.");
          return;
        }
        setParsedGroup(items);
        setChoices(
          Object.fromEntries(
            items
              .filter((t) => isConflict(t.date))
              .map((t) => [t.date, "keep" as const]),
          ),
        );
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Bestand kon niet worden gelezen.",
      );
    }
  }

  function apply() {
    const replaceDates = Object.entries(choices)
      .filter(([, choice]) => choice === "replace")
      .map(([date]) => date);
    if (mode === "full" && parsedFull) {
      const toImport = parsedFull.filter(
        (t) => !existingDates.includes(t.date) || replaceDates.includes(t.date),
      );
      props.onImport(toImport, replaceDates);
    } else if (mode !== "full" && parsedGroup) {
      props.onImportGroup(mode, parsedGroup, replaceDates);
    }
  }

  function reset() {
    setParsedFull(null);
    setParsedGroup(null);
    setChoices({});
    setError(null);
  }

  function setAll(choice: "replace" | "keep") {
    setChoices(Object.fromEntries(conflicts.map((date) => [date, choice])));
  }

  const groupName = mode === "full" ? null : (FIXED_SLOT_NAMES[mode] ?? mode);

  return (
    <div className="import-overlay" onClick={props.onClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="import-modal-header">
          <h3>Schema importeren</h3>
          <button className="import-close" onClick={props.onClose}>
            ×
          </button>
        </div>

        {parsed === null ? (
          <>
            <div className="import-mode-tabs">
              {MODE_LABELS.map(({ mode: m, label }) => (
                <button
                  key={m}
                  className={mode === m ? "is-active" : ""}
                  onClick={() => {
                    setMode(m);
                    reset();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === "full" ? (
              <p>
                Upload het complete schema voor de komende periode. Alleen de
                datumkolom is verplicht — lege of ontbrekende kolommen worden
                overgeslagen. T1 en T2 hebben nooit een schema, alleen een
                onderdeelnaam. De kolom <i>available trainers</i> bevat de
                trainers van die dag; de <b>eerste naam is het aanspreekpunt</b>.
              </p>
            ) : (
              <p>
                Upload alle <b>{groupName}</b>-schema's voor de komende
                periode in één keer: twee kolommen, datum en schema.
                Trainingsdagen die nog niet bestaan worden aangemaakt; dagen
                zonder {groupName}-schema worden aangevuld.
              </p>
            )}

            <div className="import-format-tabs">
              <button
                className={format === "csv" ? "is-active" : ""}
                onClick={() => setFormat("csv")}
              >
                CSV
              </button>
              <button
                className={format === "json" ? "is-active" : ""}
                onClick={() => setFormat("json")}
              >
                JSON
              </button>
            </div>
            <pre className="import-example">
              {mode === "full"
                ? format === "csv"
                  ? FULL_CSV_EXAMPLE
                  : FULL_JSON_EXAMPLE
                : format === "csv"
                  ? GROUP_CSV_EXAMPLE
                  : GROUP_JSON_EXAMPLE}
            </pre>
            {error && <p className="import-error">{error}</p>}
            <div className="import-actions">
              <input
                ref={fileInput}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => fileInput.current?.click()}
              >
                Kies bestand…
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <b>{parsed.length}</b>{" "}
              {mode === "full" ? "trainingen" : `${groupName}-schema's`}{" "}
              gevonden
              {conflicts.length > 0 && (
                <>
                  , waarvan <b>{conflicts.length}</b>{" "}
                  {mode === "full"
                    ? "op een datum waar al een training staat."
                    : `op een dag die al een ${groupName}-schema heeft.`}
                </>
              )}
            </p>

            {conflicts.length > 0 && (
              <div className="import-conflicts">
                <div className="import-conflict-bulk">
                  <button
                    className="btn btn-small"
                    onClick={() => setAll("replace")}
                  >
                    Alles vervangen
                  </button>
                  <button
                    className="btn btn-small btn-ghost"
                    onClick={() => setAll("keep")}
                  >
                    Alles behouden
                  </button>
                </div>
                <ul>
                  {conflicts.map((date) => (
                    <li key={date} className="import-conflict-row">
                      <span className="import-conflict-date">
                        {formatWeekday(date)} {formatDayMonth(date)}
                      </span>
                      <label>
                        <input
                          type="radio"
                          name={`conflict-${date}`}
                          checked={choices[date] === "keep"}
                          onChange={() =>
                            setChoices({ ...choices, [date]: "keep" })
                          }
                        />
                        Bestaande behouden
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`conflict-${date}`}
                          checked={choices[date] === "replace"}
                          onChange={() =>
                            setChoices({ ...choices, [date]: "replace" })
                          }
                        />
                        Vervangen
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="import-actions">
              <button className="btn btn-ghost" onClick={reset}>
                Ander bestand
              </button>
              <button className="btn btn-primary" onClick={apply}>
                Importeren
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
