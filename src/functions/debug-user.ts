// Debug user for testing member-only features without a backend (DEV only).
// Stores state in sessionStorage so it resets when the tab is closed.

import type { SessionInfo, Birthday } from "./backend.ts";

const STORAGE_KEY = "dodeka-debug-user";

const DEBUG_SESSION: SessionInfo = {
  user: {
    user_id: "0_arnold_debugvarken",
    email: "arnold@dsavdodeka.nl",
    firstname: "Arnold",
    lastname: "het Aardvarken",
    permissions: ["member"],
  },
  created_at: Date.now() / 1000,
  expires_at: null,
};

export function isDebugUserActive(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function toggleDebugUser(): boolean {
  const next = !isDebugUserActive();
  if (next) {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  return next;
}

export function getDebugSession(): SessionInfo | null {
  if (!isDebugUserActive()) return null;
  return DEBUG_SESSION;
}

const DEBUG_BIRTHDAYS: Birthday[] = [
  {
    user_id: "0_arnold_debugvarken",
    voornaam: "Arnold",
    tussenvoegsel: "het",
    achternaam: "Aardvarken",
    geboortedatum: "1999-03-14",
  },
  {
    user_id: "0_debug_koers",
    voornaam: "Koers",
    tussenvoegsel: "",
    achternaam: "Klaproos",
    geboortedatum: "2001-07-02",
  },
  {
    user_id: "0_debug_steeple",
    voornaam: "Steeple",
    tussenvoegsel: "van",
    achternaam: "Horden",
    geboortedatum: "2000-12-21",
  },
];

export function getDebugBirthdays(): Birthday[] | null {
  if (!isDebugUserActive()) return null;
  return DEBUG_BIRTHDAYS;
}

function placeholderImage(color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${color}"/><text x="400" y="315" font-family="sans-serif" font-size="48" fill="white" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const DEBUG_PRIVATE: Record<string, unknown> = {
  fotos_events: [
    {
      id: "debug-nsk-baan",
      name: "NSK Baan",
      date: "2026-06-14",
      type: "Wedstrijd",
      image: placeholderImage("#cb4b3d", "NSK Baan"),
      links: [
        { label: "dump", url: "https://example.com/dump" },
        { label: "dodeka", url: "https://example.com/dodeka" },
      ],
    },
    {
      id: "debug-trainingsweekend",
      name: "Trainingsweekend Ardennen",
      date: "2026-04-20",
      type: "Reis",
      image: placeholderImage("#001f48", "Ardennen"),
      links: [
        { label: "alles", url: "https://example.com/alles" },
        { label: "focus", url: "https://example.com/focus" },
        { label: "drone", url: "https://example.com/drone" },
      ],
    },
    {
      id: "debug-borrel",
      name: "Eindejaarsborrel",
      date: "2025-12-19",
      type: "Gezelligheid",
      image: placeholderImage("#93a3b1", "Borrel"),
      links: [{ label: "dump", url: "https://example.com/dump" }],
    },
    {
      id: "debug-baantraining",
      name: "Baantraining zomer",
      date: "2025-07-08",
      type: "Training",
      image: placeholderImage("#2a9d8f", "Training"),
      links: [],
    },
  ],
};

export function getDebugPrivate(key: string): unknown | null {
  if (!isDebugUserActive()) return null;
  return DEBUG_PRIVATE[key] ?? null;
}
