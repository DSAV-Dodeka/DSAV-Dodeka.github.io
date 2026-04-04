import { useState, useRef, useEffect, useCallback } from "react";
import PageTitle from "../../components/PageTitle";
import { TimerDisplay } from "./components/TimerDisplay";
import { TimerControls } from "./components/TimerControls";
import { StopTimesList } from "./components/StopTimesList";
import { TimeSelector } from "./components/TimeSelector";
import { Leaderboard, buildLeaderboard } from "./components/Leaderboard";
import { formatTime } from "./utils";
import type { Phase, TimesEntry } from "./utils";
import timesDataFile from "../../content/KomkommerTijden.json";
import "./komkommer.scss";

const timesData = (timesDataFile as any).tijden as TimesEntry[];

interface PreviousResult {
  tijd: number;
  naam: string;
}

function getRank(tijd: number, data: TimesEntry[], name: string): number {
  const entries = buildLeaderboard(data, tijd, name);
  return entries.find((e) => e.isUser)?.rank ?? 0;
}

function Komkommer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [stopTimes, setStopTimes] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [previousResults, setPreviousResults] = useState<PreviousResult[]>([]);
  const [userName, setUserName] = useState("Jij");

  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // rAF loop for running phase
  useEffect(() => {
    if (phase !== "running") return;

    const loop = () => {
      if (startTimeRef.current !== null) {
        setElapsed(performance.now() - startTimeRef.current);
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [phase]);

  const getCurrentElapsed = useCallback(() => {
    if (startTimeRef.current === null) return elapsed;
    return performance.now() - startTimeRef.current;
  }, [elapsed]);

  const cancelTimer = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    setStopTimes([]);
    setSelectedTime(null);
    setElapsed(0);
    startTimeRef.current = performance.now();
    setPhase("running");
  }, []);

  const handleStop = useCallback(() => {
    const current = getCurrentElapsed();
    setStopTimes((prev) => [...prev, current]);
  }, [getCurrentElapsed]);

  const handleDone = useCallback(() => {
    cancelTimer();
    const finalElapsed = getCurrentElapsed();
    setElapsed(finalElapsed);
    // Klaar always records the final time
    setStopTimes((prev) => [...prev, finalElapsed]);
    setPhase("selecting");
  }, [getCurrentElapsed, cancelTimer]);

  const handleTimeSelect = useCallback((timeMs: number) => {
    setSelectedTime(timeMs);
    setPreviousResults((prev) => [
      ...prev,
      { tijd: timeMs, naam: userName || "Jij" },
    ]);
    setPhase("leaderboard");
  }, [userName]);

  const handleRestart = useCallback(() => {
    setStopTimes([]);
    setSelectedTime(null);
    setElapsed(0);
    startTimeRef.current = null;
    setPhase("idle");
  }, []);

  return (
    <div className="komkommer-page">
      <div className="komkommer-bg" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="komkommer-bg__slice" />
        ))}
      </div>
      <div className="komkommer-content">
        <PageTitle title=".ComCommerTimer" />
        <div className="disclaimer-banner">
          De komkommer moet minimaal 28 cm zijn
        </div>

        {phase === "idle" && (
          <div className="name-input">
            <label htmlFor="userName" className="name-input__label">Je naam</label>
            <input
              id="userName"
              type="text"
              className="name-input__field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Vul je naam in"
            />
          </div>
        )}

        {(phase === "idle" || phase === "running") && (
          <>
            <TimerDisplay elapsed={elapsed} />
            <TimerControls
              phase={phase}
              onStart={handleStart}
              onStop={handleStop}
              onDone={handleDone}
              onRestart={handleRestart}
            />
          </>
        )}

        {phase === "running" && <StopTimesList stopTimes={stopTimes} />}

        {phase === "selecting" && (
          <TimeSelector stopTimes={stopTimes} onSelect={handleTimeSelect} />
        )}

        {phase === "leaderboard" && selectedTime !== null && (
          <Leaderboard userTime={selectedTime} userName={userName || "Jij"} />
        )}

        {phase === "leaderboard" && (
          <TimerControls
            phase={phase}
            onStart={handleStart}
            onStop={handleStop}
            onDone={handleDone}
            onRestart={handleRestart}
          />
        )}

        {phase === "leaderboard" && previousResults.length > 1 && (
          <div className="previous-times">
            <h3 className="previous-times__heading">Eerdere tijden</h3>
            <ol className="previous-times__list">
              {previousResults.slice(0, -1).map((result, i) => (
                <li key={i} className="previous-times__item">
                  <span className="previous-times__rank">#{getRank(result.tijd, timesData, result.naam)}</span>
                  <span className="previous-times__name">{result.naam}</span>
                  <span className="previous-times__time">
                    {formatTime(result.tijd)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default Komkommer;
