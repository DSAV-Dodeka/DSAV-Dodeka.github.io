import { useState } from "react";
import type {
  TrainingRun,
  ExperienceLevel,
  PRValues,
  PRDistance,
  Gender,
} from "../../../functions/sprint-calculator";
import {
  ALL_DISTANCES,
  calculateTargetTime,
  calculateDistanceForDuration,
  roundToWholeSeconds,
  findClosestLevel,
  prValuesToSortedPRs,
  getExperienceLevelPRs,
  getTopLevelLabel,
} from "../../../functions/sprint-calculator";

interface ReferentieTabelProps {
  runs: TrainingRun[];
  selectedLevel: ExperienceLevel | null;
  userPRValues: PRValues;
  gender: Gender;
}

const LEVELS: ExperienceLevel[] = [
  "beginner",
  "novice",
  "intermediate",
  "gevorderd",
  "elite",
  "legende",
];

const LEVELS_WITH_BOLT: ExperienceLevel[] = [...LEVELS, "bolt"];

function getLevelLabels(gender: Gender): Record<ExperienceLevel, string> {
  return {
    beginner: "Verse Sprinter",
    novice: "Enthousiast",
    intermediate: "Groeiend Talent",
    gevorderd: "Doorgewinterd",
    elite: "Sprintkanon",
    legende: "Legende",
    bolt: getTopLevelLabel(gender),
  };
}

function ReferentieTabel({
  runs,
  selectedLevel,
  userPRValues,
  gender,
}: ReferentieTabelProps) {
  const [showTable, setShowTable] = useState(false);

  const levelLabels = getLevelLabels(gender);
  const experienceLevelPRs = getExperienceLevelPRs(gender);

  // Determine highlighted level
  let highlightedLevel: ExperienceLevel | null = selectedLevel;
  if (!highlightedLevel) {
    highlightedLevel = findClosestLevel(userPRValues);
  }

  // Filter valid runs (distance with distance set, or duration with duration set)
  const validRuns = runs.filter(
    (run) =>
      (run.mode === "distance" && run.distance != null) ||
      (run.mode === "duration" && run.duration != null)
  );

  const isDurationMode = validRuns.length > 0 && validRuns[0]!.mode === "duration";

  return (
    <section className="referentie-tabel">
      {/* Training runs tables — one per gender */}
      {validRuns.length > 0 && (
        <>
          {(["mannen", "vrouwen"] as const).map((g) => {
            const gLabels = getLevelLabels(g);
            const gPRs = getExperienceLevelPRs(g);
            return (
              <div key={g}>
                <h2>Referentie{isDurationMode ? "afstanden" : "tijden"} {g === "mannen" ? "Mannen" : "Vrouwen"}</h2>
                <div className="referentie-tabel__table-scroll">
                  <table className="referentie-tabel__table">
                    <thead>
                      <tr>
                        <th className="referentie-tabel__header">Loopje</th>
                        {LEVELS.map((level) => (
                          <th
                            key={level}
                            className={`referentie-tabel__header${
                              g === gender && level === highlightedLevel ? " referentie-tabel__col--highlight" : ""
                            }`}
                          >
                            {gLabels[level]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validRuns.map((run) => (
                        <tr key={run.id} className="referentie-tabel__row">
                          <td className="referentie-tabel__cell">
                            {run.mode === "distance"
                              ? `${run.distance}m @ ${run.percentage}%`
                              : `${run.duration}s @ ${run.percentage}%`}
                          </td>
                          {LEVELS.map((level) => {
                            const sortedPrs = prValuesToSortedPRs(gPRs[level]);
                            if (run.mode === "duration") {
                              const distanceAt100 = calculateDistanceForDuration(run.duration!, sortedPrs);
                              const estimatedDistance = distanceAt100 * (run.percentage / 100);
                              return (
                                <td
                                  key={level}
                                  className={`referentie-tabel__cell${
                                    g === gender && level === highlightedLevel ? " referentie-tabel__col--highlight" : ""
                                  }`}
                                >
                                  {Math.round(estimatedDistance / 10) * 10}m
                                </td>
                              );
                            }
                            const targetTime = calculateTargetTime(run.distance!, run.percentage, sortedPrs);
                            return (
                              <td
                                key={level}
                                className={`referentie-tabel__cell${
                                  g === gender && level === highlightedLevel ? " referentie-tabel__col--highlight" : ""
                                }`}
                              >
                                {roundToWholeSeconds(targetTime)}s
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* PR Reference — tooltip */}
      <div className="referentie-tabel__tooltip-container">
        <button
          type="button"
          className="referentie-tabel__tooltip-trigger"
          onClick={() => setShowTable((prev) => !prev)}
        >
          📊 PR Referentie per niveau <span className="referentie-tabel__mobile-arrow">{showTable ? "▲" : "▼"}</span>
        </button>
        <div className={`referentie-tabel__tooltip-popup${showTable ? " referentie-tabel__tooltip-popup--open" : ""}`}>
          <table className="referentie-tabel__table">
            <thead>
              <tr>
                <th className="referentie-tabel__header">Afstand</th>
                {LEVELS_WITH_BOLT.map((level) => (
                  <th
                    key={level}
                    className={`referentie-tabel__header${
                      level === highlightedLevel ? " referentie-tabel__col--highlight" : ""
                    }`}
                  >
                    {levelLabels[level]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_DISTANCES.map((distance: PRDistance) => (
                <tr key={distance} className="referentie-tabel__row">
                  <td className="referentie-tabel__cell">{distance}m</td>
                  {LEVELS_WITH_BOLT.map((level) => (
                    <td
                      key={level}
                      className={`referentie-tabel__cell${
                        level === highlightedLevel ? " referentie-tabel__col--highlight" : ""
                      }`}
                    >
                      {experienceLevelPRs[level][distance]}s
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ReferentieTabel;
