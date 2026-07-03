import { useState } from "react";
import { useNavigate } from "react-router";
import { useSessionInfo } from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import type { Attendee, ImportedTraining, TrainingDay } from "./types";
import { MOCK_USER, makeMockStandings, makeMockTrainings } from "./mock-data";
import { toTrainingDay } from "./utils";
import TrainingCard from "./components/TrainingCard";
import CompetitionPanel from "./components/CompetitionPanel";
import ImportModal from "./components/ImportModal";
import "./inschrijven-training.scss";

// Permission sets for the DEV-only "view as" switcher, so every view can be
// tested without a backend.
const DEV_VIEW_PERMISSIONS: Record<string, string[]> = {
  Lid: ["member"],
  Trainer: ["member", "trainers"],
  Bestuur: ["member", "bestuur"],
};

function userInDay(training: TrainingDay, userId: string): boolean {
  return training.events.some((event) =>
    event.attendees.some((a) => a.user_id === userId),
  );
}

function sortByDate(trainings: TrainingDay[]): TrainingDay[] {
  return [...trainings].sort((a, b) => a.date.localeCompare(b.date));
}

export default function InschrijvenTraining() {
  const navigate = useNavigate();
  const { data: session, isLoading } = useSessionInfo();
  const devMode = import.meta.env.DEV;

  const [devView, setDevView] = useState("Lid");
  const [trainings, setTrainings] = useState(() =>
    sortByDate(makeMockTrainings()),
  );
  const [standings, setStandings] = useState(makeMockStandings);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [manageMode, setManageMode] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [newDate, setNewDate] = useState("");

  if (isLoading && !devMode) {
    return <PageTitle title="Inschrijven trainingen" />;
  }

  if (!session && !devMode) {
    return (
      <>
        <PageTitle title="Inschrijven trainingen" />
        <p className="training-status">
          Deze pagina is helaas niet toegankelijk als je niet ingelogd bent.
          Log in om deze pagina te kunnen bekijken.
        </p>
        <div className="training-login">
          <button
            onClick={() => navigate("/account/login")}
            className="training-login-button"
          >
            Inloggen
          </button>
        </div>
      </>
    );
  }

  const permissions = devMode
    ? (DEV_VIEW_PERMISSIONS[devView] ?? ["member"])
    : (session?.user.permissions ?? []);
  const isBoard =
    permissions.includes("bestuur") || permissions.includes("admin");
  const isTrainer = permissions.includes("trainers") || isBoard;
  const isMember = permissions.includes("member") || isTrainer;

  if (!isMember) {
    return (
      <>
        <PageTitle title="Inschrijven trainingen" />
        <p className="training-status">
          Je hebt een actief lidmaatschap nodig om deze pagina te bekijken.
        </p>
      </>
    );
  }

  const currentUser: Attendee = session
    ? {
        user_id: session.user.user_id,
        name: `${session.user.firstname} ${session.user.lastname}`,
      }
    : MOCK_USER;

  function adjustPoints(user: Attendee, delta: number) {
    setStandings((prev) => {
      const existing = prev.find((s) => s.user_id === user.user_id);
      if (!existing) {
        return delta > 0
          ? [...prev, { user_id: user.user_id, name: user.name, points: delta }]
          : prev;
      }
      return prev.map((s) =>
        s.user_id === user.user_id
          ? { ...s, points: Math.max(0, s.points + delta) }
          : s,
      );
    });
  }

  // Sign the current user up for an event (or out, when already signed up).
  // You join one event per training day: signing up for another event moves
  // you. Competition points follow day attendance: +1 the first time you join
  // a day, -1 when you leave it entirely.
  function handleSignup(trainingId: string, eventId: string) {
    const training = trainings.find((t) => t.training_id === trainingId);
    if (!training || training.cancelled) return;

    const wasInDay = userInDay(training, currentUser.user_id);
    const wasInEvent = training.events
      .find((e) => e.event_id === eventId)
      ?.attendees.some((a) => a.user_id === currentUser.user_id);

    const updated: TrainingDay = {
      ...training,
      events: training.events.map((event) => {
        const attendees = event.attendees.filter(
          (a) => a.user_id !== currentUser.user_id,
        );
        if (event.event_id === eventId && !wasInEvent) {
          attendees.push({ ...currentUser });
        }
        return { ...event, attendees };
      }),
    };

    setTrainings(
      trainings.map((t) => (t.training_id === trainingId ? updated : t)),
    );
    const isInDay = userInDay(updated, currentUser.user_id);
    if (!wasInDay && isInDay) adjustPoints(currentUser, 1);
    if (wasInDay && !isInDay) adjustPoints(currentUser, -1);
  }

  // Trainer action: remove a no-show from an event (also retracts their
  // competition point for this day).
  function handleRemoveAttendee(
    trainingId: string,
    eventId: string,
    userId: string,
  ) {
    const training = trainings.find((t) => t.training_id === trainingId);
    const removed = training?.events
      .find((e) => e.event_id === eventId)
      ?.attendees.find((a) => a.user_id === userId);
    if (!training || !removed) return;

    const updated: TrainingDay = {
      ...training,
      events: training.events.map((event) =>
        event.event_id === eventId
          ? {
              ...event,
              attendees: event.attendees.filter((a) => a.user_id !== userId),
            }
          : event,
      ),
    };
    setTrainings(
      trainings.map((t) => (t.training_id === trainingId ? updated : t)),
    );
    if (!userInDay(updated, userId)) adjustPoints(removed, -1);
  }

  function retractDayPoints(training: TrainingDay) {
    const seen = new Set<string>();
    for (const event of training.events) {
      for (const attendee of event.attendees) {
        if (!seen.has(attendee.user_id)) {
          seen.add(attendee.user_id);
          adjustPoints(attendee, -1);
        }
      }
    }
  }

  function handleDelete(trainingId: string) {
    const training = trainings.find((t) => t.training_id === trainingId);
    if (!training) return;
    if (!window.confirm("Weet je zeker dat je deze training wilt verwijderen?")) {
      return;
    }
    retractDayPoints(training);
    setTrainings(trainings.filter((t) => t.training_id !== trainingId));
  }

  function handleAddTraining() {
    if (!newDate) return;
    if (trainings.some((t) => t.date === newDate)) {
      window.alert("Er staat al een training op deze datum.");
      return;
    }
    const added = toTrainingDay(
      {
        date: newDate,
        sprint_schedule: null,
        mila_schedule: null,
        loopgroep_schedule: null,
        t1_event: null,
        t2_event: null,
        available_trainers: null,
        warmup_trainers: null,
      },
      `training_${newDate}`,
    );
    setTrainings(sortByDate([...trainings, added]));
    setNewDate("");
  }

  function handleImport(
    imported: ImportedTraining[],
    replaceDates: string[],
  ) {
    const replaced = trainings.filter((t) => replaceDates.includes(t.date));
    replaced.forEach(retractDayPoints);
    const kept = trainings.filter((t) => !replaceDates.includes(t.date));
    const added = imported.map((imp) =>
      toTrainingDay(imp, `training_${imp.date}`),
    );
    setTrainings(sortByDate([...kept, ...added]));
    setImportOpen(false);
  }

  return (
    <>
      <PageTitle title="Inschrijven trainingen" />
      <div className="training-page">
        <div className="training-toolbar">
          <div className="training-legend">
            <span className="legend-chip legend-ma">Maandag</span>
            <span className="legend-chip legend-wo">Woensdag</span>
            <span className="legend-chip legend-za">Zaterdag</span>
          </div>
          {isTrainer && (
            <div className="training-trainer-tools">
              <button
                className="btn btn-small"
                onClick={() => setImportOpen(true)}
              >
                Schema importeren
              </button>
              <button
                className={`btn btn-small ${manageMode ? "btn-primary" : ""}`}
                onClick={() => setManageMode(!manageMode)}
              >
                {manageMode ? "Beheren: aan" : "Beheren"}
              </button>
            </div>
          )}
        </div>

        {manageMode && (
          <div className="training-add-day">
            <span>Nieuwe training:</span>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <button className="btn btn-small" onClick={handleAddTraining}>
              + Toevoegen
            </button>
          </div>
        )}

        {isBoard && <CompetitionPanel standings={standings} />}

        <div className="training-list">
          {trainings.map((training) => (
            <TrainingCard
              key={training.training_id}
              training={training}
              currentUser={currentUser}
              expanded={expandedId === training.training_id}
              onToggle={() =>
                setExpandedId(
                  expandedId === training.training_id
                    ? null
                    : training.training_id,
                )
              }
              manageMode={manageMode && isTrainer}
              onSignup={(eventId) =>
                handleSignup(training.training_id, eventId)
              }
              onRemoveAttendee={(eventId, userId) =>
                handleRemoveAttendee(training.training_id, eventId, userId)
              }
              onUpdate={(update) =>
                setTrainings((prev) =>
                  prev.map((t) =>
                    t.training_id === training.training_id ? update(t) : t,
                  ),
                )
              }
              onDelete={() => handleDelete(training.training_id)}
            />
          ))}
        </div>
      </div>

      {importOpen && (
        <ImportModal
          existingDates={trainings.map((t) => t.date)}
          onClose={() => setImportOpen(false)}
          onImport={handleImport}
        />
      )}

      {devMode && (
        <div className="training-dev-switcher">
          <span>Bekijk als:</span>
          {Object.keys(DEV_VIEW_PERMISSIONS).map((view) => (
            <button
              key={view}
              className={devView === view ? "is-active" : ""}
              onClick={() => {
                setDevView(view);
                const perms = DEV_VIEW_PERMISSIONS[view] ?? [];
                if (
                  !perms.includes("trainers") &&
                  !perms.includes("bestuur")
                ) {
                  setManageMode(false);
                }
              }}
            >
              {view}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
