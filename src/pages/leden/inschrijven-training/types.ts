// Types for the training sign-up feature. These mirror the backend
// specification in docs/training-backend-spec.md — keep them in sync so
// swapping the mock data for real API calls is a drop-in change.

export interface Attendee {
  user_id: string;
  name: string;
}

// Every training day has the same five groups: the three fixed running
// groups (which always come with a workout schedule) and two technical
// slots (T1/T2) whose event differs per training and never has a schedule.
export type GroupSlot = "sprint" | "mila" | "loopgroep" | "t1" | "t2";

export interface TrainingEvent {
  event_id: string;
  slot: GroupSlot;
  // "Sprint" / "MiLa" / "Loopgroep" for the fixed groups; the event name
  // (e.g. "Kogel") for t1/t2. Null for an unused technical slot.
  name: string | null;
  // Workout schedule, only for sprint/mila/loopgroep.
  schedule: string | null;
  // Short trainer note shown to everyone, e.g. "Neem spikes mee".
  comment: string | null;
  attendees: Attendee[];
}

export interface TrainingDay {
  training_id: string;
  // ISO date, e.g. "2026-07-06"
  date: string;
  start_time: string;
  end_time: string | null;
  cancelled: { reason: string } | null;
  // The five trainers of this training, comma-separated. The first name is
  // the contact point ("aanspreekpunt") for the day.
  trainers: string | null;
  // Who leads the joint warming-up.
  warmup_trainers: string | null;
  events: TrainingEvent[];
}

export interface CompetitionStanding {
  user_id: string;
  name: string;
  points: number;
}

// The three groups that carry a workout schedule (T1/T2 never do).
export type ScheduleSlot = "sprint" | "mila" | "loopgroep";

// A training day parsed from a full-schedule import file, before it gets an
// id. Columns: date, sprint/mila/loopgroep schedule, t1/t2 event, available
// trainers, warm-up trainers. Only the date is required; all other columns
// may be missing or empty.
export interface ImportedTraining {
  date: string;
  sprint_schedule: string | null;
  mila_schedule: string | null;
  loopgroep_schedule: string | null;
  t1_event: string | null;
  t2_event: string | null;
  available_trainers: string | null;
  warmup_trainers: string | null;
}

// One row of a per-group import: a trainer uploads all schedules for their
// own group (e.g. all Sprint trainings) in one go.
export interface ImportedGroupSchedule {
  date: string;
  schedule: string | null;
}
