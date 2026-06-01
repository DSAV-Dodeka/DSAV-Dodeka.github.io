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
