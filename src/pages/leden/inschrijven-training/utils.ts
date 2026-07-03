import type { GroupSlot, ImportedTraining, TrainingDay } from "./types";

const WEEKDAYS_LONG = [
  "Zondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
];

const MONTHS_SHORT = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

export function weekdayOf(isoDate: string): number {
  return new Date(`${isoDate}T12:00:00`).getDay();
}

export function formatWeekday(isoDate: string): string {
  return WEEKDAYS_LONG[weekdayOf(isoDate)] ?? "";
}

export function formatDayMonth(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

// Maps a date to the css modifier that colors the card: monday, wednesday and
// saturday each have a fixed color so the days are easy to tell apart.
export function dayColorClass(isoDate: string): string {
  switch (weekdayOf(isoDate)) {
    case 1:
      return "day-ma";
    case 3:
      return "day-wo";
    case 6:
      return "day-za";
    default:
      return "day-other";
  }
}

// Default training times: Ma/Wo evening, Za morning.
export function defaultTimes(isoDate: string): {
  start_time: string;
  end_time: string;
} {
  return weekdayOf(isoDate) === 6
    ? { start_time: "10:15", end_time: "11:45" }
    : { start_time: "18:15", end_time: "19:45" };
}

// --- Schedule import parsing -------------------------------------------------
// Two formats are supported, matching the backend spec. Both carry the same
// eight fields per training day:
//   date, sprint schedule, mila schedule, loopgroep schedule,
//   t1 event, t2 event, available trainers, warm-up trainers
// CSV cells may be quoted and contain newlines (multiline schedules from
// Excel/Sheets exports).

export function parseImportFile(
  filename: string,
  content: string,
): ImportedTraining[] {
  if (filename.toLowerCase().endsWith(".json")) {
    return parseJsonImport(content);
  }
  return parseCsvImport(content);
}

const JSON_FIELDS = [
  "sprint_schedule",
  "mila_schedule",
  "loopgroep_schedule",
  "t1_event",
  "t2_event",
  "available_trainers",
  "warmup_trainers",
] as const;

function parseJsonImport(content: string): ImportedTraining[] {
  const data: unknown = JSON.parse(content);
  if (!Array.isArray(data)) {
    throw new Error("JSON-bestand moet een lijst van trainingen zijn.");
  }
  return data.map((raw, i) => {
    const item = raw as Record<string, unknown>;
    const date = item["date"];
    if (typeof date !== "string" || !isIsoDate(date)) {
      throw new Error(
        `Training ${i + 1}: ongeldige datum (verwacht JJJJ-MM-DD).`,
      );
    }
    const imported: ImportedTraining = {
      date,
      sprint_schedule: null,
      mila_schedule: null,
      loopgroep_schedule: null,
      t1_event: null,
      t2_event: null,
      available_trainers: null,
      warmup_trainers: null,
    };
    for (const field of JSON_FIELDS) {
      const value = item[field];
      if (typeof value === "string" && value.trim() !== "") {
        imported[field] = value;
      }
    }
    return imported;
  });
}

function parseCsvImport(content: string): ImportedTraining[] {
  const rows = parseCsvRows(content).filter((row) =>
    row.some((cell) => cell.trim() !== ""),
  );
  if (rows.length === 0) {
    throw new Error("Het bestand is leeg.");
  }
  // Skip an optional header row
  const startIndex = rows[0]?.[0]?.trim().toLowerCase() === "date" ? 1 : 0;

  return rows.slice(startIndex).map((row, i) => {
    const line = startIndex + i + 1;
    if (row.length < 8) {
      throw new Error(
        `Regel ${line}: verwacht 8 kolommen (date, sprint schedule, mila schedule, loopgroep schedule, t1 event, t2 event, available trainers, warm-up trainers).`,
      );
    }
    const cell = (index: number): string | null => {
      const value = (row[index] ?? "").trim();
      return value === "" ? null : value;
    };
    const date = (row[0] ?? "").trim();
    if (!isIsoDate(date)) {
      throw new Error(
        `Regel ${line}: ongeldige datum "${date}" (verwacht JJJJ-MM-DD).`,
      );
    }
    return {
      date,
      sprint_schedule: cell(1),
      mila_schedule: cell(2),
      loopgroep_schedule: cell(3),
      t1_event: cell(4),
      t2_event: cell(5),
      available_trainers: cell(6),
      warmup_trainers: cell(7),
    };
  });
}

// CSV parser with support for quoted cells containing commas, escaped
// quotes ("") and newlines, as produced by Excel/Google Sheets exports.
function parseCsvRows(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && content[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// The five groups of every training day, in display and import order.
export const SLOT_ORDER: GroupSlot[] = [
  "sprint",
  "mila",
  "loopgroep",
  "t1",
  "t2",
];

export const FIXED_SLOT_NAMES: Partial<Record<GroupSlot, string>> = {
  sprint: "Sprint",
  mila: "MiLa",
  loopgroep: "Loopgroep",
};

// Splits a comma-separated name list into clean names.
export function splitNames(names: string | null): string[] {
  return (names ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");
}

export function toTrainingDay(
  imported: ImportedTraining,
  id: string,
): TrainingDay {
  const slotName = (slot: GroupSlot): string | null => {
    if (slot === "t1") return imported.t1_event;
    if (slot === "t2") return imported.t2_event;
    return FIXED_SLOT_NAMES[slot] ?? null;
  };
  const slotSchedule = (slot: GroupSlot): string | null => {
    if (slot === "sprint") return imported.sprint_schedule;
    if (slot === "mila") return imported.mila_schedule;
    if (slot === "loopgroep") return imported.loopgroep_schedule;
    return null;
  };

  return {
    training_id: id,
    date: imported.date,
    ...defaultTimes(imported.date),
    cancelled: null,
    trainers: imported.available_trainers,
    warmup_trainers: imported.warmup_trainers,
    events: SLOT_ORDER.map((slot) => ({
      event_id: `${id}_${slot}`,
      slot,
      name: slotName(slot),
      schedule: slotSchedule(slot),
      comment: null,
      attendees: [],
    })),
  };
}
