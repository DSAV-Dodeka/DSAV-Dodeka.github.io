import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import turfjesData from "../../content/turfjes.json";
import "./turfjes.scss";

interface Turfje {
  naam: string;
  datum: string;
  aantal: number;
  reden: string;
}

interface PersonTotal {
  naam: string;
  totaal: number;
}

// Graph colors per person (cycles if more people than colors)
const GRAPH_COLORS = [
  "#001f48",
  "#0066cc",
  "#e63946",
  "#2a9d8f",
  "#e9c46a",
  "#f4a261",
  "#7209b7",
  "#06d6a0",
];

function getTotals(turfjes: Turfje[]): PersonTotal[] {
  const map = new Map<string, number>();
  for (const t of turfjes) {
    map.set(t.naam, (map.get(t.naam) ?? 0) + t.aantal);
  }
  return Array.from(map.entries())
    .map(([naam, totaal]) => ({ naam, totaal }))
    .sort((a, b) => b.totaal - a.totaal);
}

function getMedalEmoji(rank: number): string {
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return "";
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface CumulativePoint {
  date: string;
  values: Map<string, number>;
  // How many turfjes were added on this date per person
  dayChanges: Map<string, number>;
  // Reasons per person on this date
  dayReasons: Map<string, string[]>;
}

function buildCumulativeData(turfjes: Turfje[], people: string[]): CumulativePoint[] {
  const dates = [...new Set(turfjes.map((t) => t.datum))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const cumulative = new Map<string, number>();
  for (const person of people) {
    cumulative.set(person, 0);
  }

  const points: CumulativePoint[] = [];

  for (const date of dates) {
    const dayEntries = turfjes.filter((t) => t.datum === date);
    const dayChanges = new Map<string, number>();
    const dayReasons = new Map<string, string[]>();

    for (const entry of dayEntries) {
      cumulative.set(entry.naam, (cumulative.get(entry.naam) ?? 0) + entry.aantal);
      dayChanges.set(entry.naam, (dayChanges.get(entry.naam) ?? 0) + entry.aantal);
      if (entry.reden) {
        const reasons = dayReasons.get(entry.naam) ?? [];
        reasons.push(entry.reden);
        dayReasons.set(entry.naam, reasons);
      }
    }
    points.push({ date, values: new Map(cumulative), dayChanges, dayReasons });
  }

  return points;
}

interface TooltipData {
  person: string;
  date: string;
  cumulative: number;
  change: number;
  reason: string;
  color: string;
  x: number;
  y: number;
}

function TurfjesGraph({ turfjes, people }: { turfjes: Turfje[]; people: string[] }) {
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const data = buildCumulativeData(turfjes, people);

  if (data.length === 0) return null;

  // SVG dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 50, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values for Y axis (support negative)
  const allValues = data.flatMap((point) => Array.from(point.values.values()));
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);
  const yRange = maxValue - minValue || 1;

  // X positions
  const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  // Map value to Y coordinate
  const valueToY = (value: number) =>
    padding.top + chartHeight - (((value - minValue) / yRange) * chartHeight);

  // Build path for each person
  const paths = people.map((person, personIndex) => {
    const points = data.map((point, i) => {
      const x = padding.left + (data.length > 1 ? i * xStep : chartWidth / 2);
      const y = valueToY(point.values.get(person) ?? 0);
      const cumulative = point.values.get(person) ?? 0;
      const change = point.dayChanges.get(person) ?? 0;
      return { x, y, cumulative, change, date: point.date };
    });

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const color = GRAPH_COLORS[personIndex % GRAPH_COLORS.length] ?? "#001f48";
    const isHovered = hoveredPerson === person;
    const isDimmed = hoveredPerson !== null && !isHovered;

    return { person, pathD, points, color, isHovered, isDimmed };
  });

  // Y axis grid lines
  const yTicks: { value: number; y: number }[] = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const value = Math.round(minValue + (yRange / tickCount) * i);
    const y = valueToY(value);
    yTicks.push({ value, y });
  }

  // Zero line position (if negative values exist)
  const zeroY = minValue < 0 ? valueToY(0) : null;

  const handleDotClick = (person: string, pointIndex: number, color: string) => {
    const point = data[pointIndex];
    if (!point) return;
    const cumulative = point.values.get(person) ?? 0;
    const change = point.dayChanges.get(person) ?? 0;
    const reasons = point.dayReasons.get(person) ?? [];
    const reason = reasons.join(", ");
    const x = padding.left + (data.length > 1 ? pointIndex * xStep : chartWidth / 2);
    const y = valueToY(cumulative);

    // Toggle tooltip
    if (tooltip?.person === person && tooltip?.date === point.date) {
      setTooltip(null);
    } else {
      setTooltip({ person, date: point.date, cumulative, change, reason, color, x, y });
    }
  };

  const showTooltip = (person: string, pointIndex: number, color: string) => {
    const point = data[pointIndex];
    if (!point) return;
    const cumulative = point.values.get(person) ?? 0;
    const change = point.dayChanges.get(person) ?? 0;
    const reasons = point.dayReasons.get(person) ?? [];
    const reason = reasons.join(", ");
    const x = padding.left + (data.length > 1 ? pointIndex * xStep : chartWidth / 2);
    const y = valueToY(cumulative);
    setTooltip({ person, date: point.date, cumulative, change, reason, color, x, y });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <div className="turfjes-graph">
      <div className="turfjes-graph__container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="turfjes-graph__svg"
          aria-label="Turfjes over tijd grafiek"
          onClick={(e) => {
            // Close tooltip when clicking empty space
            if ((e.target as Element).tagName === "svg") setTooltip(null);
          }}
        >
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                className="turfjes-graph__grid-line"
              />
              <text
                x={padding.left - 8}
                y={tick.y + 4}
                className="turfjes-graph__y-label"
              >
                {tick.value}
              </text>
            </g>
          ))}

          {/* Zero line */}
          {zeroY !== null && (
            <line
              x1={padding.left}
              y1={zeroY}
              x2={width - padding.right}
              y2={zeroY}
              className="turfjes-graph__zero-line"
            />
          )}

          {/* X axis labels */}
          {data.map((point, i) => {
            const x = padding.left + (data.length > 1 ? i * xStep : chartWidth / 2);
            if (data.length > 6 && i % Math.ceil(data.length / 6) !== 0 && i !== data.length - 1) {
              return null;
            }
            return (
              <text
                key={point.date}
                x={x}
                y={height - 10}
                className="turfjes-graph__x-label"
              >
                {formatDateShort(point.date)}
              </text>
            );
          })}

          {/* Lines */}
          {paths.map(({ person, pathD, color, isDimmed }) => (
            <path
              key={person}
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={isDimmed ? 1.5 : 2.5}
              opacity={isDimmed ? 0.2 : 1}
              className="turfjes-graph__line"
            />
          ))}

          {/* Clickable/hoverable dots */}
          {paths.map(({ person, points, color, isDimmed }) =>
            points.map((point, i) => (
              <circle
                key={`${person}-${i}`}
                cx={point.x}
                cy={point.y}
                r={isDimmed ? 2.5 : (tooltip?.person === person && tooltip?.date === data[i]?.date) ? 6 : 4}
                fill={color}
                opacity={isDimmed ? 0.2 : 1}
                className="turfjes-graph__dot"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => showTooltip(person, i, color)}
                onMouseLeave={() => hideTooltip()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(person, i, color);
                }}
              />
            ))
          )}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="turfjes-graph__tooltip"
            style={{
              left: `${(tooltip.x / width) * 100}%`,
              top: `${(tooltip.y / height) * 100}%`,
            }}
          >
            <div className="turfjes-graph__tooltip-arrow" />
            <div className="turfjes-graph__tooltip-content">
              <span
                className="turfjes-graph__tooltip-name"
                style={{ color: tooltip.color }}
              >
                {tooltip.person}
              </span>
              <span className="turfjes-graph__tooltip-date">
                {formatDateFull(tooltip.date)}
              </span>
              <div className="turfjes-graph__tooltip-stats">
                <span className="turfjes-graph__tooltip-total">
                  Totaal: {tooltip.cumulative}
                </span>
                {tooltip.change !== 0 && (
                  <span
                    className={`turfjes-graph__tooltip-change ${tooltip.change > 0 ? "turfjes-graph__tooltip-change--positive" : "turfjes-graph__tooltip-change--negative"}`}
                  >
                    {tooltip.change > 0 ? `+${tooltip.change}` : tooltip.change} op deze dag
                  </span>
                )}
              </div>
              {tooltip.reason && (
                <span className="turfjes-graph__tooltip-reason">
                  {tooltip.reason}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="turfjes-graph__legend">
        {people.map((person, i) => (
          <button
            key={person}
            className={`turfjes-graph__legend-item ${hoveredPerson === person ? "turfjes-graph__legend-item--active" : ""} ${hoveredPerson !== null && hoveredPerson !== person ? "turfjes-graph__legend-item--dimmed" : ""}`}
            onMouseEnter={() => setHoveredPerson(person)}
            onMouseLeave={() => setHoveredPerson(null)}
            onClick={() => setHoveredPerson(hoveredPerson === person ? null : person)}
          >
            <span
              className="turfjes-graph__legend-dot"
              style={{ backgroundColor: GRAPH_COLORS[i % GRAPH_COLORS.length] }}
            />
            {person}
          </button>
        ))}
      </div>
    </div>
  );
}

interface PersonStats {
  naam: string;
  gained: number;
  lost: number;
  totaal: number;
}

function getPersonStats(turfjes: Turfje[]): PersonStats[] {
  const map = new Map<string, { gained: number; lost: number }>();
  for (const t of turfjes) {
    const current = map.get(t.naam) ?? { gained: 0, lost: 0 };
    if (t.aantal >= 0) {
      current.gained += t.aantal;
    } else {
      current.lost += Math.abs(t.aantal);
    }
    map.set(t.naam, current);
  }
  return Array.from(map.entries())
    .map(([naam, { gained, lost }]) => ({ naam, gained, lost, totaal: gained - lost }))
    .sort((a, b) => b.totaal - a.totaal);
}

function TurfjesDetails({ turfjes, people }: { turfjes: Turfje[]; people: string[] }) {
  const stats = getPersonStats(turfjes);

  // Map person name to their graph color
  const colorMap = new Map(people.map((name, i) => [name, GRAPH_COLORS[i % GRAPH_COLORS.length] ?? "#001f48"]));

  return (
    <div className="turfjes-details">
      <div className="turfjes-details__graph">
        <TurfjesGraph turfjes={turfjes} people={people} />
      </div>
      <div className="turfjes-details__sidebar">
        <h3 className="turfjes-details__sidebar-title">Per persoon</h3>
        <div className="turfjes-details__list">
          {stats.map((person) => (
            <div key={person.naam} className="turfjes-details__person">
              <div className="turfjes-details__person-header">
                <span
                  className="turfjes-details__person-color"
                  style={{ backgroundColor: colorMap.get(person.naam) }}
                />
                <span className="turfjes-details__person-name">{person.naam}</span>
              </div>
              <div className="turfjes-details__person-stats">
                <span className="turfjes-details__stat turfjes-details__stat--gained">
                  +{person.gained}
                </span>
                <span className="turfjes-details__stat turfjes-details__stat--lost">
                  −{person.lost}
                </span>
                <span className="turfjes-details__stat turfjes-details__stat--total">
                  = {person.totaal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Turfjes() {
  const turfjes = turfjesData.turfjes as Turfje[];
  const totals = getTotals(turfjes);
  const maxTotaal = totals[0]?.totaal ?? 1;
  const people = totals.map((t) => t.naam);

  const [activeTab, setActiveTab] = useState<"overzicht" | "details">("overzicht");

  return (
    <div className="turfjes-page">
      <PageTitle title="Turfjes" />

      <div className="turfjes-tabs">
        <button
          className={`turfjes-tab ${activeTab === "overzicht" ? "turfjes-tab--active" : ""}`}
          onClick={() => setActiveTab("overzicht")}
        >
          <span className="turfjes-tab__icon">📊</span>
          Overzicht
        </button>
        <button
          className={`turfjes-tab ${activeTab === "details" ? "turfjes-tab--active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          <span className="turfjes-tab__icon">📈</span>
          Details
        </button>
      </div>

      {activeTab === "overzicht" && (
        <div className="turfjes-totaal">
          <div className="turfjes-totaal__header">
            <span className="turfjes-totaal__count">
              {totals.reduce((sum, p) => sum + p.totaal, 0)} turfjes totaal
            </span>
            <span className="turfjes-totaal__people">
              {totals.length} {totals.length === 1 ? "persoon" : "personen"}
            </span>
          </div>

          <div className="turfjes-leaderboard">
            {totals.map((person, index) => (
              <div
                key={person.naam}
                className={`turfjes-leaderboard__item ${index < 3 ? "turfjes-leaderboard__item--top" : ""}`}
              >
                <div className="turfjes-leaderboard__rank">
                  {getMedalEmoji(index) || `#${index + 1}`}
                </div>
                <div className="turfjes-leaderboard__info">
                  <span className="turfjes-leaderboard__name">
                    {person.naam}
                  </span>
                  <div className="turfjes-leaderboard__bar-container">
                    <div
                      className="turfjes-leaderboard__bar"
                      style={{ width: `${(person.totaal / maxTotaal) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="turfjes-leaderboard__count">
                  {person.totaal}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <TurfjesDetails turfjes={turfjes} people={people} />
      )}
    </div>
  );
}

export default Turfjes;
