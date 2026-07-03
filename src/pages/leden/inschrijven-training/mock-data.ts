// Mock data until the backend endpoints from docs/training-backend-spec.md
// exist. Dates are generated relative to today so the page always shows
// upcoming trainings.

import type { CompetitionStanding, TrainingDay, TrainingEvent } from "./types";
import { defaultTimes } from "./utils";

export const MOCK_USER = {
  user_id: "0_arnold_debugvarken",
  name: "Arnold het Aardvarken",
};

const NAMES = [
  "Koers Klaproos",
  "Steeple van Horden",
  "Milo Meters",
  "Vera Verspringen",
  "Daan Discus",
  "Sanne Sprint",
  "Pim Polsstok",
  "Lotte Loopgroep",
  "Casper Kogel",
  "Hanna Hink",
];

function attendees(count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[(i + offset) % NAMES.length] ?? "Onbekend Lid";
    const first = name.split(" ")[0] ?? name;
    return { user_id: `0_mock_${first.toLowerCase()}`, name };
  });
}

const SPRINT_SCHEDULE = `Warming-up: 2 rondjes + loopscholing
Kern: 3× 3×60m vliegend, rust 3' / serierust 6'
Afsluiting: 4× starts uit blokken + core`;

const MILA_SCHEDULE = `Warming-up: 15' inlopen + versnellingen
Kern: 6× 800m @ 10k-tempo, rust 90"
Afsluiting: 10' uitlopen`;

const LOOPGROEP_SCHEDULE = `Warming-up: 10' rustig inlopen
Kern: 40' duurloop D1/D2 in groepen
Afsluiting: rekken en core`;

function baseEvents(id: string, t1: string, t2: string | null): TrainingEvent[] {
  return [
    {
      event_id: `${id}_sprint`,
      slot: "sprint",
      name: "Sprint",
      schedule: SPRINT_SCHEDULE,
      comment: "Neem je spikes mee!",
      attendees: attendees(3),
    },
    {
      event_id: `${id}_mila`,
      slot: "mila",
      name: "MiLa",
      schedule: MILA_SCHEDULE,
      comment: null,
      attendees: attendees(3, 3),
    },
    {
      event_id: `${id}_loopgroep`,
      slot: "loopgroep",
      name: "Loopgroep",
      schedule: LOOPGROEP_SCHEDULE,
      comment: null,
      attendees: attendees(2, 6),
    },
    {
      event_id: `${id}_t1`,
      slot: "t1",
      name: t1,
      schedule: null,
      comment: null,
      attendees: attendees(2, 8),
    },
    {
      event_id: `${id}_t2`,
      slot: "t2",
      name: t2,
      schedule: null,
      comment: null,
      attendees: [],
    },
  ];
}

function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// The next three weeks of Mon (1), Wed (3) and Sat (6) trainings.
function upcomingTrainingDates(): string[] {
  const dates: string[] = [];
  for (let offset = 0; offset < 21 && dates.length < 8; offset++) {
    const iso = isoDaysFromNow(offset);
    const weekday = new Date(`${iso}T12:00:00`).getDay();
    if (weekday === 1 || weekday === 3 || weekday === 6) {
      dates.push(iso);
    }
  }
  return dates;
}

const T1_EVENTS = ["Kogel", "Ver", "Speer", "Hoog"];
const T2_EVENTS = ["Discus", "Hinkstap", null, "Polsstok"];

export function makeMockTrainings(): TrainingDay[] {
  return upcomingTrainingDates().map((date, i) => {
    const id = `training_${date}`;
    const training: TrainingDay = {
      training_id: id,
      date,
      ...defaultTimes(date),
      cancelled: null,
      trainers: "Jasmijn, Karel, Roos, Sven, Nina",
      warmup_trainers: "Jasmijn",
      events: baseEvents(
        id,
        T1_EVENTS[i % T1_EVENTS.length] ?? "Kogel",
        T2_EVENTS[i % T2_EVENTS.length] ?? null,
      ),
    };
    // One cancelled training to show that state
    if (i === 3) {
      training.cancelled = { reason: "NSK Teams" };
      training.events = training.events.map((event) => ({
        ...event,
        attendees: [],
      }));
    }
    // Sign the mock user up for the second training so the
    // "ingeschreven" state is visible.
    const firstEvent = training.events[0];
    if (i === 1 && firstEvent) {
      firstEvent.attendees = [...firstEvent.attendees, { ...MOCK_USER }];
    }
    return training;
  });
}

export function makeMockStandings(): CompetitionStanding[] {
  const points = [24, 21, 19, 17, 16, 12, 11, 9, 6, 4];
  return NAMES.map((name, i) => ({
    user_id: `0_mock_${(name.split(" ")[0] ?? name).toLowerCase()}`,
    name,
    points: points[i] ?? 0,
  })).concat([{ user_id: MOCK_USER.user_id, name: MOCK_USER.name, points: 14 }]);
}
