import { useState, useRef, useEffect, useCallback } from "react";
import PageTitle from "$components/PageTitle.tsx";
import "./reactietest.scss";

type Phase = "idle" | "places" | "waiting" | "go" | "early" | "result";

const HIGHSCORE_KEY = "reactietest-highscore";

function getStoredHighscore(): number | null {
  const raw = localStorage.getItem(HIGHSCORE_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function Reactietest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [highscore, setHighscore] = useState<number | null>(() =>
    getStoredHighscore(),
  );

  const goAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startRound = useCallback(() => {
    setReactionTime(null);
    setPhase("places");

    timeoutRef.current = setTimeout(() => {
      setPhase("waiting");

      const delay = 1500 + Math.random() * 2500;
      timeoutRef.current = setTimeout(() => {
        goAtRef.current = performance.now();
        setPhase("go");
      }, delay);
    }, 800);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      startRound();
      return;
    }

    if (phase === "places" || phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("early");
      return;
    }

    if (phase === "go" && goAtRef.current !== null) {
      const time = Math.round(performance.now() - goAtRef.current);
      setReactionTime(time);
      setPhase("result");

      if (highscore === null || time < highscore) {
        setHighscore(time);
        localStorage.setItem(HIGHSCORE_KEY, String(time));
      }
    }
  }, [phase, highscore, startRound]);

  const label = {
    idle: "Klik om te starten",
    places: "Op uw plaatsen...",
    waiting: "Klaar...",
    go: "KLIK!",
    early: "Te vroeg! Klik om het opnieuw te proberen",
    result: `${reactionTime} ms — klik om opnieuw te proberen`,
  }[phase];

  return (
    <div className="reactietest-page">
      <PageTitle title="Reactietest" />
      {highscore !== null && (
        <p className="reactietest-highscore">Beste tijd: {highscore} ms</p>
      )}
      <button
        type="button"
        className={`reactietest-tile reactietest-tile--${phase}`}
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}
