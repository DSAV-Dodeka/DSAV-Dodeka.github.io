import { useRef, useState } from "react";
import type { ImportedTraining } from "../types";
import { formatDayMonth, formatWeekday, parseImportFile } from "../utils";
import "./ImportModal.scss";

// "available trainers": the five trainers of the day, first name is the
// contact point.
const CSV_EXAMPLE = `date,sprint schedule,mila schedule,loopgroep schedule,t1 event,t2 event,available trainers,warm-up trainers
2026-07-06,"Kern: 3× 3×60m vliegend","6× 800m, rust 90\\"","40' duurloop D1/D2",Kogel,Discus,"Jasmijn, Karel, Roos, Sven, Nina",Jasmijn
2026-07-08,"4× starts uit blokken","8× 400m","35' duurloop",Ver,,"Karel, Roos, Jasmijn, Nina, Sven",Roos`;

const JSON_EXAMPLE = `[
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

interface ImportModalProps {
  // Dates that already have a training, used for conflict detection.
  existingDates: string[];
  onClose: () => void;
  // Trainings to add + the existing dates the trainer chose to overwrite.
  onImport: (trainings: ImportedTraining[], replaceDates: string[]) => void;
}

export default function ImportModal(props: ImportModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ImportedTraining[] | null>(null);
  const [choices, setChoices] = useState<Record<string, "replace" | "keep">>(
    {},
  );
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const fileInput = useRef<HTMLInputElement>(null);

  const conflicts = (parsed ?? []).filter((t) =>
    props.existingDates.includes(t.date),
  );

  async function handleFile(file: File) {
    setError(null);
    try {
      const content = await file.text();
      const trainings = parseImportFile(file.name, content);
      if (trainings.length === 0) {
        setError("Geen trainingen gevonden in het bestand.");
        return;
      }
      setParsed(trainings);
      const conflicting = trainings.filter((t) =>
        props.existingDates.includes(t.date),
      );
      setChoices(
        Object.fromEntries(conflicting.map((t) => [t.date, "keep" as const])),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bestand kon niet worden gelezen.");
    }
  }

  function apply() {
    if (!parsed) return;
    const replaceDates = Object.entries(choices)
      .filter(([, choice]) => choice === "replace")
      .map(([date]) => date);
    const toImport = parsed.filter(
      (t) =>
        !props.existingDates.includes(t.date) || replaceDates.includes(t.date),
    );
    props.onImport(toImport, replaceDates);
  }

  function setAll(choice: "replace" | "keep") {
    setChoices(
      Object.fromEntries(conflicts.map((t) => [t.date, choice])),
    );
  }

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
            <p>
              Upload het schema voor de komende periode in één keer als CSV
              (bijv. een export uit Excel of Sheets) of JSON. Per dag: de
              schema's voor Sprint, MiLa en Loopgroep, de technische
              onderdelen (T1/T2) en de trainersbezetting. De kolom{" "}
              <i>available trainers</i> bevat de vijf trainers van die dag;
              de <b>eerste naam is het aanspreekpunt</b>.
            </p>
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
              {format === "csv" ? CSV_EXAMPLE : JSON_EXAMPLE}
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
              <b>{parsed.length}</b> trainingen gevonden
              {conflicts.length > 0 && (
                <>
                  , waarvan <b>{conflicts.length}</b> op een datum waar al een
                  training staat.
                </>
              )}
            </p>

            {conflicts.length > 0 && (
              <div className="import-conflicts">
                <div className="import-conflict-bulk">
                  <button className="btn btn-small" onClick={() => setAll("replace")}>
                    Alles vervangen
                  </button>
                  <button className="btn btn-small btn-ghost" onClick={() => setAll("keep")}>
                    Alles behouden
                  </button>
                </div>
                <ul>
                  {conflicts.map((training) => (
                    <li key={training.date} className="import-conflict-row">
                      <span className="import-conflict-date">
                        {formatWeekday(training.date)} {formatDayMonth(training.date)}
                      </span>
                      <label>
                        <input
                          type="radio"
                          name={`conflict-${training.date}`}
                          checked={choices[training.date] === "keep"}
                          onChange={() =>
                            setChoices({ ...choices, [training.date]: "keep" })
                          }
                        />
                        Bestaande behouden
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`conflict-${training.date}`}
                          checked={choices[training.date] === "replace"}
                          onChange={() =>
                            setChoices({
                              ...choices,
                              [training.date]: "replace",
                            })
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
              <button className="btn btn-ghost" onClick={() => setParsed(null)}>
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
