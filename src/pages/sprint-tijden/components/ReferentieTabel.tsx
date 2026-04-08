import { useState } from "react";
import type {
  TrainingRun,
  ExperienceLevel,
  PRValues,
  PRDistance,
} from "../../../functions/sprint-calculator";
import {
  EXPERIENCE_LEVEL_PRS,
  ALL_DISTANCES,
  calculateTargetTime,
  roundToWholeSeconds,
  findClosestLevel,
  prValuesToSortedPRs,
} from "../../../functions/sprint-calculator";

interface ReferentieTabelProps {
  runs: TrainingRun[];
  selectedLevel: ExperienceLevel | null;
  userPRValues: PRValues;
}

const LEVELS: ExperienceLevel[] = [
  "beginner",
  "novice",
  "intermediate",
  "gevorderd",
  "elite",
];

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Verse Sprinter",
  novice: "Enthousiast",
  intermediate: "Doorgewinterd",
  gevorderd: "Sprintkanon",
  elite: "Legende",
};

function ReferentieTabel({
  runs,
  selectedLevel,
  userPRValues,
}: ReferentieTabelProps) {
  const [showPRRef, setShowPRRef] = useState(false);
  // Determine highlighted level
  let highlightedLevel: ExperienceLevel | null = selectedLevel;
  if (!highlightedLevel) {
    highlightedLevel = findClosestLevel(userPRValues);
  }

  // Filter valid distance-mode runs
  const validRuns = runs.filter(
    (run) => run.mode === "distance" && run.distance != null
  );

  return (
    <section className="referentie-tabel">
      <h2>Referentietijden per Niveau</h2>

      {/* Training runs table */}
      {validRuns.length > 0 && (
        <table className="referentie-tabel__table">
          <thead>
            <tr>
              <th className="referentie-tabel__header">Loopje</th>
              {LEVELS.map((level) => (
                <th
                  key={level}
                  className={`referentie-tabel__header${
                    level === highlightedLevel
                      ? " referentie-tabel__col--highlight"
                      : ""
                  }`}
                >
                  {LEVEL_LABELS[level]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validRuns.map((run) => {
              return (
                <tr key={run.id} className="referentie-tabel__row">
                  <td className="referentie-tabel__cell">
                    {run.distance}m @ {run.percentage}%
                  </td>
                  {LEVELS.map((level) => {
                    const levelPrs = EXPERIENCE_LEVEL_PRS[level];
                    const sortedPrs = prValuesToSortedPRs(levelPrs);
                    const targetTime = calculateTargetTime(
                      run.distance!,
                      run.percentage,
                      sortedPrs
                    );
                    return (
                      <td
                        key={level}
                        className={`referentie-tabel__cell${
                          level === highlightedLevel
                            ? " referentie-tabel__col--highlight"
                            : ""
                        }`}
                      >
                        {roundToWholeSeconds(targetTime)}s
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Reference PRs — collapsible */}
      <div className="referentie-tabel__toggle-container">
        <button
          type="button"
          className="referentie-tabel__toggle-btn"
          onClick={() => setShowPRRef((prev) => !prev)}
        >
          📊 PR Referentie per niveau {showPRRef ? "▲" : "▼"}
        </button>
      </div>
      {showPRRef && (
        <table className="referentie-tabel__table">
        <thead>
          <tr>
            <th className="referentie-tabel__header">Afstand</th>
            {LEVELS.map((level) => (
              <th
                key={level}
                className={`referentie-tabel__header${
                  level === highlightedLevel
                    ? " referentie-tabel__col--highlight"
                    : ""
                }`}
              >
                {LEVEL_LABELS[level]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_DISTANCES.map((distance: PRDistance) => (
            <tr key={distance} className="referentie-tabel__row">
              <td className="referentie-tabel__cell">{distance}m</td>
              {LEVELS.map((level) => (
                <td
                  key={level}
                  className={`referentie-tabel__cell${
                    level === highlightedLevel
                      ? " referentie-tabel__col--highlight"
                      : ""
                  }`}
                >
                  {EXPERIENCE_LEVEL_PRS[level][distance]}s
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </section>
  );
}

export default ReferentieTabel;
