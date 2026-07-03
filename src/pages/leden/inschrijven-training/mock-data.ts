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

// Realistic example schedules (as actually written by trainers), cycled per
// training so the preview doesn't repeat the exact same schema every day.
// MiLa genuinely doesn't get a schedule every training — some slots are
// intentionally left null here to match that.
const SPRINT_SCHEDULES: string[] = [
  `Wedstrijd warming up
Startblok: wedstrijdsimulatie
0-5 x 30m 95% vliegende start
SP = 3 min
Spikes = Ja`,
  `6-7 x 67m
p = 6-7 min
67%
spikes = ja met 6-7 puntjes`,
  `Onderhoud schema lang
Lange sprint: lange vs korte lopers
Lange sprinters: 200 - 250 - 300 (- 200)
Korte sprinters: 120 - 150 - 180 (- 120)
80-90% SP = 7 min
Spikes: nee (tenzij wedstrijden)`,
  `onderhoud schema kort
70-80-90-100-90-80-70
P = 3 min
Spikes: nee (tenzij wedstrijden)`,
];

const MILA_SCHEDULES: (string | null)[] = [
  `Competitie voorbereiding 800, 1500, 3000, 5000`,
  `VO2-max training: 6-7x700 op 5000m tempo; P=600 joggen`,
  null,
  null,
];

const LOOPGROEP_SCHEDULES: string[] = [
  `Long run (50-70') D0`,
  `2 x (6'-7') LT1
HP=4' D1`,
  `10x600m LT2
HP=200m D1`,
  `Long run (50-70') D1`,
];

function baseEvents(
  id: string,
  index: number,
  t1: string,
  t2: string | null,
): TrainingEvent[] {
  const sprintSchedule =
    SPRINT_SCHEDULES[index % SPRINT_SCHEDULES.length] ?? null;
  const milaSchedule = MILA_SCHEDULES[index % MILA_SCHEDULES.length] ?? null;
  const loopgroepSchedule =
    LOOPGROEP_SCHEDULES[index % LOOPGROEP_SCHEDULES.length] ?? null;
  return [
    {
      event_id: `${id}_sprint`,
      slot: "sprint",
      name: "Sprint",
      schedule: sprintSchedule,
      comment: sprintSchedule?.includes("Spikes = Ja")
        ? "Neem je spikes mee!"
        : null,
      attendees: attendees(3),
    },
    {
      event_id: `${id}_mila`,
      slot: "mila",
      name: "MiLa",
      schedule: milaSchedule,
      comment: null,
      attendees: attendees(3, 3),
    },
    {
      event_id: `${id}_loopgroep`,
      slot: "loopgroep",
      name: "Loopgroep",
      schedule: loopgroepSchedule,
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

// Technisch 1 / Technisch 2, paired per training the way trainers actually
// fill them in.
const T1_EVENTS = ["Hoog", "Horde", "Hoog", "Ver"];
const T2_EVENTS = ["Kogel", "Discus", "Kogel", "Speer"];

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
        i,
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
