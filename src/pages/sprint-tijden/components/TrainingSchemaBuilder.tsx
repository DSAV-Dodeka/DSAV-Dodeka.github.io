import { useState } from "react";
import type { TrainingRun } from "../../../functions/sprint-calculator";
import { PRESET_DISTANCES, PRESET_PERCENTAGES } from "../../../functions/sprint-calculator";

const PRESET_DURATIONS = [20, 25, 30, 35, 40, 45, 50, 55, 60];

interface TrainingSchemaBuilderProps {
  runs: TrainingRun[];
  mode: 'distance' | 'duration';
  onAddRun: () => void;
  onRemoveRun: (id: number) => void;
  onUpdateRun: (id: number, updates: Partial<TrainingRun>) => void;
  onModeChange: (mode: 'distance' | 'duration') => void;
}

function TrainingSchemaBuilder({ runs, mode, onAddRun, onRemoveRun, onUpdateRun, onModeChange }: TrainingSchemaBuilderProps) {
  // Track which runs have custom values selected (not matching a preset)
  const [customDistance, setCustomDistance] = useState<Record<number, boolean>>({});
  const [customDuration, setCustomDuration] = useState<Record<number, boolean>>({});
  const [customPercentage, setCustomPercentage] = useState<Record<number, boolean>>({});

  const handleDistanceSelect = (id: number, value: string) => {
    if (value === "custom") {
      setCustomDistance((prev) => ({ ...prev, [id]: true }));
    } else {
      setCustomDistance((prev) => ({ ...prev, [id]: false }));
      onUpdateRun(id, { distance: Number(value) });
    }
  };

  const handleDurationSelect = (id: number, value: string) => {
    if (value === "custom") {
      setCustomDuration((prev) => ({ ...prev, [id]: true }));
    } else {
      setCustomDuration((prev) => ({ ...prev, [id]: false }));
      onUpdateRun(id, { duration: Number(value) });
    }
  };

  const handlePercentageSelect = (id: number, value: string) => {
    if (value === "custom") {
      setCustomPercentage((prev) => ({ ...prev, [id]: true }));
    } else {
      setCustomPercentage((prev) => ({ ...prev, [id]: false }));
      onUpdateRun(id, { percentage: Number(value) });
    }
  };

  const handleCustomDistanceInput = (id: number, value: string) => {
    const num = value === "" ? null : Number(value);
    onUpdateRun(id, { distance: num });
  };

  const handleCustomDurationInput = (id: number, value: string) => {
    const num = value === "" ? null : Number(value);
    onUpdateRun(id, { duration: num });
  };

  const handleCustomPercentageInput = (id: number, value: string) => {
    const num = value === "" ? 100 : Number(value);
    onUpdateRun(id, { percentage: num });
  };

  const isCustomDistance = (run: TrainingRun) =>
    customDistance[run.id] || (run.distance != null && !PRESET_DISTANCES.includes(run.distance));

  const isCustomDuration = (run: TrainingRun) =>
    customDuration[run.id] || (run.duration != null && !PRESET_DURATIONS.includes(run.duration));

  const isCustomPercentage = (run: TrainingRun) =>
    customPercentage[run.id] || !PRESET_PERCENTAGES.includes(run.percentage);

  const SORTED_PERCENTAGES = [...PRESET_PERCENTAGES].reverse();

  return (
    <section className="training-schema">
      <h2>Trainingsschema</h2>

      <div className="training-schema__mode-toggle">
        <button
          type="button"
          className={`training-schema__mode-btn ${mode === "distance" ? "training-schema__mode-btn--active" : ""}`}
          onClick={() => onModeChange("distance")}
        >
          Afstand
        </button>
        <button
          type="button"
          className={`training-schema__mode-btn ${mode === "duration" ? "training-schema__mode-btn--active" : ""}`}
          onClick={() => onModeChange("duration")}
        >
          Duur
        </button>
      </div>

      <div className="training-schema__runs">
        {runs.map((run, index) => (
          <div key={run.id} className="training-schema__run-row">
            <div className="training-schema__run-header">
              <span className="training-schema__run-label">Loopje {index + 1}</span>
              <button
                type="button"
                className="training-schema__delete-btn"
                onClick={() => onRemoveRun(run.id)}
                title="Verwijderen"
              >
                ×
              </button>
            </div>

            {/* Distance/Duration + Percentage side by side */}
            <div className="training-schema__run-fields">
              {/* Distance or Duration selector */}
              <div className="training-schema__run-field">
                {mode === "distance" ? (
                <>
                  <select
                    className="training-schema__select"
                    value={isCustomDistance(run) ? "custom" : String(run.distance ?? 100)}
                    onChange={(e) => handleDistanceSelect(run.id, e.target.value)}
                  >
                    {PRESET_DISTANCES.map((d) => (
                      <option key={d} value={String(d)}>{d}m</option>
                    ))}
                    <option value="custom">Aangepast...</option>
                  </select>
                  {isCustomDistance(run) && (
                    <input
                      type="number"
                      className="training-schema__input"
                      min={1}
                      max={1000}
                      placeholder="meter"
                      value={run.distance ?? ""}
                      onChange={(e) => handleCustomDistanceInput(run.id, e.target.value)}
                    />
                  )}
                </>
              ) : (
                <>
                  <select
                    className="training-schema__select"
                    value={isCustomDuration(run) ? "custom" : String(run.duration ?? 30)}
                    onChange={(e) => handleDurationSelect(run.id, e.target.value)}
                  >
                    {PRESET_DURATIONS.map((d) => (
                      <option key={d} value={String(d)}>{d}s</option>
                    ))}
                    <option value="custom">Aangepast...</option>
                  </select>
                  {isCustomDuration(run) && (
                    <input
                      type="number"
                      className="training-schema__input"
                      min={1}
                      max={300}
                      placeholder="sec"
                      value={run.duration ?? ""}
                      onChange={(e) => handleCustomDurationInput(run.id, e.target.value)}
                    />
                  )}
                </>
              )}
            </div>

            {/* Percentage selector */}
            <div className="training-schema__run-field">
              <select
                className="training-schema__select"
                value={isCustomPercentage(run) ? "custom" : String(run.percentage)}
                onChange={(e) => handlePercentageSelect(run.id, e.target.value)}
              >
                {SORTED_PERCENTAGES.map((p) => (
                  <option key={p} value={String(p)}>{p}%</option>
                ))}
                <option value="custom">Aangepast...</option>
              </select>
              {isCustomPercentage(run) && (
                <input
                  type="number"
                  className="training-schema__input"
                  min={50}
                  max={100}
                  placeholder="%"
                  value={run.percentage}
                  onChange={(e) => handleCustomPercentageInput(run.id, e.target.value)}
                />
              )}
            </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="training-schema__add-btn"
        onClick={onAddRun}
      >
        Loopje toevoegen
      </button>
    </section>
  );
}

export default TrainingSchemaBuilder;
