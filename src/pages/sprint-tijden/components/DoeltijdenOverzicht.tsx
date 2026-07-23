import type { TrainingRun, PRValues } from "../../../functions/sprint-calculator";
import {
  calculateTargetTime,
  calculateDistanceForDuration,
  prValuesToSortedPRs,
} from "../../../functions/sprint-calculator";

interface DoeltijdenOverzichtProps {
  runs: TrainingRun[];
  prValues: PRValues;
  hasPRData: boolean;
  mode: 'distance' | 'duration';
}

function DoeltijdenOverzicht({ runs, prValues, hasPRData, mode }: DoeltijdenOverzichtProps) {
  const prs = prValuesToSortedPRs(prValues);

  return (
    <section className="doeltijden-overzicht">
      <div className="doeltijden-overzicht__card">
        <h2>Berekende Doelen</h2>

        {!hasPRData ? (
          <p className="doeltijden-overzicht__placeholder">
            Vul je PR's in of selecteer je niveau om je doeltijden te zien
          </p>
        ) : (
          <table className="doeltijden-overzicht__table">
            <thead>
              <tr>
                <th>Loopje</th>
                <th>{mode === "distance" ? "Afstand" : "Duur"}</th>
                <th>Intensiteit</th>
                <th>{mode === "distance" ? "Doeltijd" : "Doelafstand"}</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run, index) => {
                let resultaat: string;
                let invoer: string;

                if (mode === "distance") {
                  const dist = run.distance ?? 100;
                  const targetTime = calculateTargetTime(dist, run.percentage, prs);
                  resultaat = `${targetTime.toFixed(1)}s`;
                  invoer = `${dist}m`;
                } else {
                  const dur = run.duration ?? 30;
                  // Bereken afstand op 100% inspanning voor deze duur,
                  // vermenigvuldig dan met percentage (sneller = meer afstand)
                  const distanceAt100 = calculateDistanceForDuration(dur, prs);
                  const estimatedDistance = distanceAt100 * (run.percentage / 100);
                  resultaat = `${Math.round(estimatedDistance / 10) * 10}m`;
                  invoer = `${dur}s`;
                }

                return (
                  <tr key={run.id} className="doeltijden-overzicht__row">
                    <td>{index + 1}</td>
                    <td>{invoer}</td>
                    <td>{run.percentage}%</td>
                    <td>{resultaat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default DoeltijdenOverzicht;
