import { formatTime } from "../utils";

interface StopTimesListProps {
  stopTimes: number[];
}

export function StopTimesList({ stopTimes }: StopTimesListProps) {
  if (stopTimes.length === 0) {
    return null;
  }

  return (
    <ol className="stop-times-list">
      {stopTimes.map((time, index) => (
        <li key={index} className="stop-times-list__item">
          <span className="stop-times-list__index">{index + 1}.</span>
          <span className="stop-times-list__time">{formatTime(time)}</span>
        </li>
      ))}
    </ol>
  );
}
