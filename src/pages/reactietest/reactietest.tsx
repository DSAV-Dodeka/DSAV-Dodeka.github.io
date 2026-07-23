import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PointerEvent,
} from "react";
import PageTitle from "$components/PageTitle.tsx";
import { useSessionInfo } from "$functions/query.ts";
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
  const { data: session, isLoading: sessionLoading } = useSessionInfo();

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

  const handleActivate = useCallback(() => {
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

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleActivate();
    },
    [handleActivate],
  );

  const label = {
    idle: "Klik om te starten",
    places: "Op uw plaatsen...",
    waiting: "Klaar...",
    go: "KLIK!",
    early: "Te vroeg! Klik om het opnieuw te proberen",
    result: `${reactionTime} ms — klik om opnieuw te proberen`,
  }[phase];

  if (sessionLoading) {
    return (
      <div className="reactietest-page">
        <PageTitle title="Reactietest" />
        <p>Laden...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="reactietest-page">
        <PageTitle title="Reactietest" />
        <p>
          Deze pagina is helaas niet toegankelijk als je niet ingelogd bent.
          Log in om deze pagina te kunnen bekijken.
        </p>
      </div>
    );
  }

  return (
    <div className="reactietest-page">
      <PageTitle title="Reactietest" />
      {highscore !== null && (
        <p className="reactietest-highscore">Beste tijd: {highscore} ms</p>
      )}
      <button
        type="button"
        className={`reactietest-tile reactietest-tile--${phase}`}
        onPointerDown={handlePointerDown}
      >
        {label}
      </button>
    </div>
  );
}
