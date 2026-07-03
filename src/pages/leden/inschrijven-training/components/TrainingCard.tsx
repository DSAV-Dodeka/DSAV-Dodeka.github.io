import { useState } from "react";
import type { Attendee, TrainingDay, TrainingEvent } from "../types";
import {
  dayColorClass,
  formatDayMonth,
  formatWeekday,
  splitNames,
} from "../utils";
import "./TrainingCard.scss";

interface TrainingCardProps {
  training: TrainingDay;
  currentUser: Attendee;
  expanded: boolean;
  onToggle: () => void;
  manageMode: boolean;
  onSignup: (eventId: string) => void;
  onRemoveAttendee: (eventId: string, userId: string) => void;
  onUpdate: (update: (training: TrainingDay) => TrainingDay) => void;
  onDelete: () => void;
}

// The three running groups always have a schedule; the technical slots
// (t1/t2) never do.
function hasSchedule(event: TrainingEvent): boolean {
  return event.slot !== "t1" && event.slot !== "t2";
}

function updateEvent(
  training: TrainingDay,
  eventId: string,
  update: (event: TrainingEvent) => TrainingEvent,
): TrainingDay {
  return {
    ...training,
    events: training.events.map((event) =>
      event.event_id === eventId ? update(event) : event,
    ),
  };
}

export default function TrainingCard(props: TrainingCardProps) {
  const { training, currentUser, manageMode } = props;
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const cancelled = training.cancelled !== null;
  // The event the current user is signed up for on this day, if any.
  const signedUpEvent = training.events.find((event) =>
    event.attendees.some((a) => a.user_id === currentUser.user_id),
  );
  const totalAttendees = training.events.reduce(
    (sum, event) => sum + event.attendees.length,
    0,
  );
  // Members only see slots that have an event; managers see all five so
  // they can fill in the technical slots.
  const visibleEvents = training.events.filter(
    (event) => manageMode || event.name !== null,
  );

  function cancelDay() {
    const reason = cancelReason.trim();
    if (reason === "") return;
    props.onUpdate((t) => ({ ...t, cancelled: { reason } }));
    setShowCancelForm(false);
    setCancelReason("");
  }

  return (
    <article
      className={[
        "training-card",
        dayColorClass(training.date),
        cancelled ? "is-cancelled" : "",
        props.expanded ? "is-open" : "",
      ].join(" ")}
    >
      <button className="card-header" onClick={props.onToggle}>
        <div className="card-date">
          <span className="card-weekday">{formatWeekday(training.date)}</span>
          <span className="card-daynum">{formatDayMonth(training.date)}</span>
        </div>
        <div className="card-summary">
          {cancelled ? (
            <span className="card-cancel-reason">
              Afgelast: {training.cancelled?.reason}
            </span>
          ) : (
            <>
              <span className="card-time">
                {training.start_time}
                {training.end_time ? ` – ${training.end_time}` : ""}
              </span>
              <span className="card-events">
                {training.events
                  .map((event) => event.name)
                  .filter((name) => name !== null)
                  .join(" · ")}
              </span>
            </>
          )}
        </div>
        <div className="card-meta">
          {signedUpEvent && !cancelled && (
            <span className="badge badge-signedup">
              ✓ Ingeschreven{signedUpEvent.name ? ` · ${signedUpEvent.name}` : ""}
            </span>
          )}
          {cancelled && <span className="badge badge-cancelled">Afgelast</span>}
          {!cancelled && (
            <span className="card-count">{totalAttendees} aanmeldingen</span>
          )}
          <span className="card-chevron" aria-hidden>
            ▾
          </span>
        </div>
      </button>

      {props.expanded && (
        <div className="card-body">
          {cancelled ? (
            <p className="card-cancelled-text">
              Deze training gaat niet door vanwege{" "}
              <b>{training.cancelled?.reason}</b>.
            </p>
          ) : (
            <>
              <TrainerPanel
                training={training}
                manageMode={manageMode}
                onUpdate={props.onUpdate}
              />
              <ul className="event-list">
                {visibleEvents.map((event) => (
                  <EventRow
                    key={event.event_id}
                    event={event}
                    currentUser={currentUser}
                    manageMode={manageMode}
                    onSignup={() => props.onSignup(event.event_id)}
                    onRemoveAttendee={(userId) =>
                      props.onRemoveAttendee(event.event_id, userId)
                    }
                    onRename={(name) =>
                      props.onUpdate((t) =>
                        updateEvent(t, event.event_id, (ev) => ({
                          ...ev,
                          name: name.trim() === "" ? null : name,
                        })),
                      )
                    }
                    onEditComment={(comment) =>
                      props.onUpdate((t) =>
                        updateEvent(t, event.event_id, (ev) => ({
                          ...ev,
                          comment: comment.trim() === "" ? null : comment,
                        })),
                      )
                    }
                    onEditSchedule={(schedule) =>
                      props.onUpdate((t) =>
                        updateEvent(t, event.event_id, (ev) => ({
                          ...ev,
                          schedule: schedule.trim() === "" ? null : schedule,
                        })),
                      )
                    }
                  />
                ))}
              </ul>
            </>
          )}

          {manageMode && (
            <div className="card-manage-footer">
              <button
                className="btn btn-small btn-ghost"
                onClick={props.onDelete}
              >
                Verwijderen
              </button>
              {cancelled ? (
                <button
                  className="btn btn-small"
                  onClick={() =>
                    props.onUpdate((t) => ({ ...t, cancelled: null }))
                  }
                >
                  Training herstellen
                </button>
              ) : showCancelForm ? (
                <div className="manage-cancel-form">
                  <input
                    type="text"
                    placeholder="Reden van afgelasting…"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && cancelDay()}
                    autoFocus
                  />
                  <button
                    className="btn btn-small btn-danger"
                    onClick={cancelDay}
                  >
                    Afgelasten
                  </button>
                  <button
                    className="btn btn-small btn-ghost"
                    onClick={() => setShowCancelForm(false)}
                  >
                    Terug
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => setShowCancelForm(true)}
                >
                  Training afgelasten
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// One container with all five trainers of the day. The first name in the
// list is the contact point and is highlighted; warm-up trainers get a tag.
function TrainerPanel(props: {
  training: TrainingDay;
  manageMode: boolean;
  onUpdate: (update: (training: TrainingDay) => TrainingDay) => void;
}) {
  const { training, manageMode } = props;
  const trainerNames = splitNames(training.trainers);
  const warmupNames = splitNames(training.warmup_trainers);
  // Warm-up trainers that are not in the trainer list still get a chip.
  const extraWarmup = warmupNames.filter(
    (name) => !trainerNames.includes(name),
  );

  if (manageMode) {
    return (
      <div className="card-trainer-info card-trainer-info-edit">
        <label className="trainer-edit-field">
          Trainers <i>(eerste naam is het aanspreekpunt)</i>
          <input
            type="text"
            value={training.trainers ?? ""}
            placeholder="Jasmijn, Karel, Roos, Sven, Nina"
            onChange={(e) =>
              props.onUpdate((t) => ({
                ...t,
                trainers:
                  e.target.value.trim() === "" ? null : e.target.value,
              }))
            }
          />
        </label>
        <label className="trainer-edit-field">
          Warming-up
          <input
            type="text"
            value={training.warmup_trainers ?? ""}
            placeholder="Wie geeft de warming-up?"
            onChange={(e) =>
              props.onUpdate((t) => ({
                ...t,
                warmup_trainers:
                  e.target.value.trim() === "" ? null : e.target.value,
              }))
            }
          />
        </label>
      </div>
    );
  }

  if (trainerNames.length === 0 && extraWarmup.length === 0) return null;

  return (
    <div className="card-trainer-info">
      <span className="trainer-info-label">Trainers</span>
      <ul className="trainer-chips">
        {trainerNames.map((name, i) => (
          <li
            key={name}
            className={[
              "trainer-chip",
              i === 0 ? "is-contact" : "",
              warmupNames.includes(name) ? "is-warmup" : "",
            ].join(" ")}
            title={
              i === 0
                ? "Aanspreekpunt"
                : warmupNames.includes(name)
                  ? "Warming-up"
                  : undefined
            }
          >
            {name}
          </li>
        ))}
        {extraWarmup.map((name) => (
          <li key={name} className="trainer-chip is-warmup" title="Warming-up">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface EventRowProps {
  event: TrainingEvent;
  currentUser: Attendee;
  manageMode: boolean;
  onSignup: () => void;
  onRemoveAttendee: (userId: string) => void;
  onRename: (name: string) => void;
  onEditComment: (comment: string) => void;
  onEditSchedule: (schedule: string) => void;
}

function EventRow(props: EventRowProps) {
  const { event, manageMode } = props;
  const isTechnical = !hasSchedule(event);
  const isSignedUp = event.attendees.some(
    (a) => a.user_id === props.currentUser.user_id,
  );

  return (
    <li className="event-row">
      <div className="event-head">
        {manageMode && isTechnical ? (
          <input
            className="event-name-input"
            type="text"
            value={event.name ?? ""}
            placeholder={`${event.slot.toUpperCase()}-onderdeel…`}
            onChange={(e) => props.onRename(e.target.value)}
          />
        ) : (
          <span className="event-name">
            {event.name}
            {isTechnical && (
              <span className="event-slot-tag">{event.slot.toUpperCase()}</span>
            )}
          </span>
        )}
        <span className="event-count">{event.attendees.length}</span>
        {!manageMode && event.name !== null && (
          <button
            className={`btn btn-signup ${isSignedUp ? "is-signedup" : ""}`}
            onClick={props.onSignup}
          >
            {isSignedUp ? "✓ Ingeschreven" : "Inschrijven"}
          </button>
        )}
      </div>

      <div className="event-detail">
        {manageMode ? (
          <>
            {!isTechnical && (
              <label className="event-edit-label">
                Trainingsschema
                <textarea
                  rows={4}
                  value={event.schedule ?? ""}
                  placeholder="Schema voor dit onderdeel…"
                  onChange={(e) => props.onEditSchedule(e.target.value)}
                />
              </label>
            )}
            <label className="event-edit-label">
              Opmerking
              <textarea
                rows={2}
                value={event.comment ?? ""}
                placeholder="Bijv. neem spikes mee…"
                onChange={(e) => props.onEditComment(e.target.value)}
              />
            </label>
          </>
        ) : (
          <>
            {event.comment && (
              <p className="event-comment">💬 {event.comment}</p>
            )}
            {!isTechnical &&
              (event.schedule ? (
                <div className="event-schedule">
                  <pre>{event.schedule}</pre>
                </div>
              ) : (
                <p className="event-no-schedule">
                  Nog geen schema beschikbaar.
                </p>
              ))}
          </>
        )}

        {event.attendees.length > 0 && (
          <div className="event-attendees">
            <span className="event-attendees-label">Aanmeldingen</span>
            <ul className="attendee-list">
              {event.attendees.map((attendee) => (
                <li
                  key={attendee.user_id}
                  className={`attendee-chip ${
                    attendee.user_id === props.currentUser.user_id
                      ? "is-you"
                      : ""
                  }`}
                >
                  {attendee.name}
                  {manageMode && (
                    <button
                      className="attendee-remove"
                      title="Verwijder van training (niet aanwezig)"
                      onClick={() => props.onRemoveAttendee(attendee.user_id)}
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
