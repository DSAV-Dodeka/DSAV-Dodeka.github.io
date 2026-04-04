import { formatTime } from "../utils";

interface TimerDisplayProps {
  elapsed: number;
}

export function TimerDisplay({ elapsed }: TimerDisplayProps) {
  return <div className="timer-display">{formatTime(elapsed)}</div>;
}
