import { useState } from "react";
import type { ExperienceLevel, PRDistance, PRValues } from "../../../functions/sprint-calculator";
import { PRIMARY_DISTANCES, SECONDARY_DISTANCES } from "../../../functions/sprint-calculator";

interface NiveauEnPRInvoerProps {
  selectedLevel: ExperienceLevel | null;
  prValues: PRValues;
  onSelectLevel: (level: ExperienceLevel | null) => void;
  onPRChange: (distance: PRDistance, value: number | null) => void;
}

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Verse Sprinter",
  novice: "Enthousiast",
  intermediate: "Doorgewinterd",
  gevorderd: "Sprintkanon",
  elite: "Legende",
};

const LEVELS: ExperienceLevel[] = ["beginner", "novice", "intermediate", "gevorderd", "elite"];

const TOOLTIP_TEXT =
  "Tijden worden berekend via lineaire interpolatie tussen bekende PR-afstanden en machtswet-extrapolatie (Riegel-formule) voor afstanden buiten bereik.";

/** Validate: positive number, max 2 decimal places */
function isValidPR(value: string): boolean {
  if (value === "") return true;
  const num = Number(value);
  if (isNaN(num) || num <= 0) return false;
  // Max 2 decimal places
  const parts = value.split(".");
  if (parts.length === 2 && parts[1]!.length > 2) return false;
  return true;
}

function PRInput({
  distance,
  value,
  onChange,
}: {
  distance: PRDistance;
  value: number | undefined;
  onChange: (distance: PRDistance, value: number | null) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!isValidPR(raw)) return;
    if (raw === "") {
      onChange(distance, null);
    } else {
      onChange(distance, Number(raw));
    }
  };

  return (
    <div className="niveau-pr-invoer__pr-field">
      <label className="niveau-pr-invoer__pr-label" htmlFor={`pr-${distance}`}>
        {distance}m
      </label>
      <input
        id={`pr-${distance}`}
        type="number"
        className="niveau-pr-invoer__pr-input"
        min={0}
        step="0.01"
        placeholder="sec"
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );
}

function NiveauEnPRInvoer({ selectedLevel, prValues, onSelectLevel, onPRChange }: NiveauEnPRInvoerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLevelClick = (level: ExperienceLevel) => {
    // Clicking already-selected level clears it
    if (selectedLevel === level) {
      onSelectLevel(null);
    } else {
      onSelectLevel(level);
    }
  };

  return (
    <section className="niveau-pr-invoer">
      <h2>Niveau &amp; PR Invoer</h2>

      {/* Experience level selection */}
      <div className="niveau-pr-invoer__levels">
        <span className="niveau-pr-invoer__levels-label">Selecteer je niveau</span>
        <div className="niveau-pr-invoer__levels-buttons">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              className={`niveau-btn${selectedLevel === level ? " niveau-btn--active" : ""}`}
              onClick={() => handleLevelClick(level)}
            >
              {LEVEL_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      {/* PR input fields */}
      <div className="niveau-pr-invoer__pr-section">
        <span className="niveau-pr-invoer__pr-section-label">Of vul ook nog je eigen PR's in <span className="niveau-pr-invoer__pr-hint">(tijden in seconden)</span></span>

        <div className="niveau-pr-invoer__pr-group">
          <span className="niveau-pr-invoer__pr-group-label">Primaire afstanden</span>
          <div className="niveau-pr-invoer__pr-fields">
            {PRIMARY_DISTANCES.map((d) => (
              <PRInput key={d} distance={d} value={prValues[d]} onChange={onPRChange} />
            ))}
          </div>
        </div>

        <div className="niveau-pr-invoer__pr-group">
          <span className="niveau-pr-invoer__pr-group-label">Secundaire afstanden</span>
          <div className="niveau-pr-invoer__pr-fields">
            {SECONDARY_DISTANCES.map((d) => (
              <PRInput key={d} distance={d} value={prValues[d]} onChange={onPRChange} />
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm tooltip — click to toggle on mobile */}
      <div className="niveau-pr-invoer__tooltip-container">
        <button
          type="button"
          className="niveau-pr-invoer__tooltip-trigger"
          onClick={() => setShowTooltip((prev) => !prev)}
          title={TOOLTIP_TEXT}
        >
          ℹ Hoe worden tijden berekend?
        </button>
        {showTooltip && (
          <p className="niveau-pr-invoer__tooltip-text">{TOOLTIP_TEXT}</p>
        )}
      </div>
    </section>
  );
}

export default NiveauEnPRInvoer;
