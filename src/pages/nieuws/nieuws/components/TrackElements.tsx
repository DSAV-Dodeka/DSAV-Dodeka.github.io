import { useMemo } from "react";
import "./TrackElements.scss";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function TrackOutline() {
  return (
    <svg className="te_track" viewBox="0 0 100 52" fill="none">
      <path
        d="M30 2 H70 A24 24 0 0 1 70 50 H30 A24 24 0 0 1 30 2 Z"
        stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none"
      />
      <path
        d="M33 8 H67 A18 18 0 0 1 67 44 H33 A18 18 0 0 1 33 8 Z"
        stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}

interface Placed { cx: number; cy: number; r: number }

function overlaps(a: Placed, others: Placed[]) {
  return others.some(b => {
    const dx = a.cx - b.cx, dy = a.cy - b.cy;
    return Math.sqrt(dx * dx + dy * dy) < a.r + b.r;
  });
}

const TARGET = 3;
const MAX_ATTEMPTS = 80;

export default function TrackBackground({ seed = 1 }: { seed?: number }) {
  const items = useMemo(() => {
    const rand = seededRandom(seed);
    const placed: Placed[] = [];
    const result: React.JSX.Element[] = [];

    for (let i = 0; i < TARGET; i++) {
      const size = 1000 + rand() * 800;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const cx = -20 + rand() * 120;
        const cy = -20 + rand() * 120;
        const candidate: Placed = { cx, cy, r: (size * 0.3) / 10 };

        if (!overlaps(candidate, placed)) {
          placed.push(candidate);
          result.push(
            <div
              key={i}
              className="te_wrap"
              style={{
                width: `${size}px`,
                height: `${size * 0.65}px`,
                left: `${cx}%`,
                top: `${cy}%`,
                transform: `translate(-50%, -50%) rotate(${rand() * 360}deg)`,
                opacity: 0.03 + rand() * 0.04,
              }}
            >
              <TrackOutline />
            </div>
          );
          break;
        }
      }
    }

    return result;
  }, [seed]);

  return (
    <div className="track_bg" aria-hidden="true">
      {items}
    </div>
  );
}
