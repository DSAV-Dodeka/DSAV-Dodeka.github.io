// Debug user for testing member-only features without a backend (DEV only).
// Stores state in sessionStorage so it resets when the tab is closed.

import type { Birthday, SessionInfo } from "./backend.ts";

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

export function getDebugBirthdays(): Birthday[] | null {
  if (!isDebugUserActive()) return null;
  return [
    {
      user_id: DEBUG_SESSION.user.user_id,
      voornaam: DEBUG_SESSION.user.firstname,
      tussenvoegsel: "het",
      achternaam: DEBUG_SESSION.user.lastname,
      geboortedatum: "25/02/2019",
    },
    {
      user_id: "0_debug_noor",
      voornaam: "Noor",
      tussenvoegsel: "",
      achternaam: "Loper",
      geboortedatum: "12/08/2002",
    },
    {
      user_id: "0_debug_sam",
      voornaam: "Sam",
      tussenvoegsel: "van",
      achternaam: "Sprint",
      geboortedatum: "03/12/2001",
    },
  ];
}
