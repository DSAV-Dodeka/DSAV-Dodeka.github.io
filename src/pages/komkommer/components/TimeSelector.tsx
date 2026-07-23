import { formatTime } from "../utils";

interface TimeSelectorProps {
  stopTimes: number[];
  onSelect: (timeMs: number) => void;
}

export function TimeSelector({ stopTimes, onSelect }: TimeSelectorProps) {
  return (
    <div className="time-selector">
      <h2 className="time-selector__heading">Kies je tijd</h2>
      <ul className="time-selector__list">
        {stopTimes.map((time, index) => (
          <li key={index} className="time-selector__item">
            <button
              className="time-selector__button"
              onClick={() => onSelect(time)}
            >
              <span className="time-selector__index">{index + 1}.</span>
              <span className="time-selector__time">{formatTime(time)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
