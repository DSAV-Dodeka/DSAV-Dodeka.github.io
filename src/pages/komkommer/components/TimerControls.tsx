import type { Phase } from "../utils";

interface TimerControlsProps {
  phase: Phase;
  onStart: () => void;
  onStop: () => void;
  onDone: () => void;
  onRestart: () => void;
}

export function TimerControls({
  phase,
  onStart,
  onStop,
  onDone,
  onRestart,
}: TimerControlsProps) {
  if (phase === "idle") {
    return (
      <div className="timer-controls">
        <button className="timer-controls__main" onClick={onStart}>
          Start
        </button>
      </div>
    );
  }

  if (phase === "running") {
    return (
      <div className="timer-controls">
        <button className="timer-controls__main" onClick={onStop}>
          Stop
        </button>
        <div className="timer-controls__secondary">
          <button className="timer-controls__done" onClick={onDone}>
            Klaar
          </button>
        </div>
      </div>
    );
  }

  if (phase === "leaderboard") {
    return (
      <div className="timer-controls">
        <button className="timer-controls__main" onClick={onRestart}>
          Opnieuw
        </button>
      </div>
    );
  }

  return null;
}
