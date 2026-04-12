import { useState, useRef, useCallback } from "react";
import PageTitle from "../../components/PageTitle";
import TrainingSchemaBuilder from "./components/TrainingSchemaBuilder";
import NiveauEnPRInvoer from "./components/NiveauEnPRInvoer";
import DoeltijdenOverzicht from "./components/DoeltijdenOverzicht";
import ReferentieTabel from "./components/ReferentieTabel";
import type {
  TrainingRun,
  PRValues,
  PRDistance,
  ExperienceLevel,
} from "../../functions/sprint-calculator";
import { getLevelPRs } from "../../functions/sprint-calculator";
import "./sprint-tijden.scss";

const DEFAULT_RUNS: TrainingRun[] = [
  { id: 1, mode: "distance", distance: 100, duration: null, percentage: 85 },
  { id: 2, mode: "distance", distance: 120, duration: null, percentage: 90 },
  { id: 3, mode: "distance", distance: 150, duration: null, percentage: 95 },
];

function SprintTijden() {
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>(DEFAULT_RUNS);
  const [prValues, setPRValues] = useState<PRValues>({});
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [trainingMode, setTrainingMode] = useState<"distance" | "duration">("distance");

  const runCounter = useRef(4);

  const handleAddRun = useCallback(() => {
    const id = runCounter.current++;
    setTrainingRuns((prev) => [
      ...prev,
      {
        id,
        mode: trainingMode,
        distance: trainingMode === "distance" ? 100 : null,
        duration: trainingMode === "duration" ? 30 : null,
        percentage: 85,
      },
    ]);
  }, [trainingMode]);

  const handleRemoveRun = useCallback((id: number) => {
    setTrainingRuns((prev) => prev.filter((run) => run.id !== id));
  }, []);

  const handleUpdateRun = useCallback((id: number, updates: Partial<TrainingRun>) => {
    setTrainingRuns((prev) =>
      prev.map((run) => (run.id === id ? { ...run, ...updates } : run))
    );
  }, []);

  const handleModeChange = useCallback((mode: "distance" | "duration") => {
    setTrainingMode(mode);
    // Update all existing runs to the new mode with sensible defaults
    setTrainingRuns((prev) =>
      prev.map((run) => ({
        ...run,
        mode,
        distance: mode === "distance" ? (run.distance ?? 100) : run.distance,
        duration: mode === "duration" ? (run.duration ?? 30) : run.duration,
      }))
    );
  }, []);

  const handleSelectLevel = useCallback((level: ExperienceLevel | null) => {
    setSelectedLevel(level);
    if (level) {
      setPRValues(getLevelPRs(level));
    }
  }, []);

  const handlePRChange = useCallback((distance: PRDistance, value: number | null) => {
    setSelectedLevel(null);
    setPRValues((prev) => {
      if (value == null) {
        const next = { ...prev };
        delete next[distance];
        return next;
      }
      return { ...prev, [distance]: value };
    });
  }, []);

  const hasPRData = Object.values(prValues).some((v) => v != null);

  return (
    <div className="sprint-tijden-page">
      <PageTitle title="Sprint Tijden" />

      <TrainingSchemaBuilder
        runs={trainingRuns}
        mode={trainingMode}
        onAddRun={handleAddRun}
        onRemoveRun={handleRemoveRun}
        onUpdateRun={handleUpdateRun}
        onModeChange={handleModeChange}
      />

      <NiveauEnPRInvoer
        selectedLevel={selectedLevel}
        prValues={prValues}
        onSelectLevel={handleSelectLevel}
        onPRChange={handlePRChange}
      />

      <DoeltijdenOverzicht
        runs={trainingRuns}
        prValues={prValues}
        hasPRData={hasPRData}
        mode={trainingMode}
      />

      <ReferentieTabel
        runs={trainingRuns}
        selectedLevel={selectedLevel}
        userPRValues={prValues}
      />
    </div>
  );
}

export default SprintTijden;
