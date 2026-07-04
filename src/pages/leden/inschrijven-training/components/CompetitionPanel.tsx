import { useState } from "react";
import type { CompetitionStanding } from "../types";
import "./CompetitionPanel.scss";

// Standings of the trainingscompetitie. Only rendered for board members
// (bestuur/admin) — regular members and trainers never see the points.
export default function CompetitionPanel(props: {
  standings: CompetitionStanding[];
}) {
  const [open, setOpen] = useState(false);
  const sorted = [...props.standings].sort((a, b) => b.points - a.points);

  return (
    <section className="competition-panel">
      <button className="competition-header" onClick={() => setOpen(!open)}>
        <span className="competition-title">
          🏆 Trainingscompetitie
          <span className="competition-boardonly">alleen zichtbaar voor bestuur</span>
        </span>
        <span className={`competition-chevron ${open ? "is-open" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <table className="competition-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Naam</th>
              <th>Punten</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((standing, i) => (
              <tr key={standing.user_id}>
                <td>{i + 1}</td>
                <td>{standing.name}</td>
                <td>{standing.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
