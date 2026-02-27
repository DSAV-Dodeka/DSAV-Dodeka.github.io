import WedstrijdenData from "../content/Wedstrijden.json";

export interface Wedstrijd {
  naam: string;
  datum: string;
  logo: string;
  info_kort: string;
  path: string;
  logo_rond?: string;
  foto?: string;
  info_lang?: string;
  tijd?: string;
  locatie?: string;
  adres?: string;
  postcode?: string;
  maps?: string;
  uitslagen?: string;
  inschrijven?: string;
  mail?: string;
  instagram?: string;
  bepalingen?: string;
}

/**
 * Get all wedstrijden (both current and old)
 */
export function getAllWedstrijden(): Wedstrijd[] {
  return [
    ...WedstrijdenData.wedstrijden,
    ...WedstrijdenData.wedstrijden_oud,
  ];
}

/**
 * Find a wedstrijd by its path
 */
export function findWedstrijdByPath(path: string): Wedstrijd | undefined {
  const allWedstrijden = getAllWedstrijden();
  return allWedstrijden.find((w) => w.path === path);
}

/**
 * Get all valid wedstrijd paths (non-empty)
 */
export function getWedstrijdPaths(): string[] {
  return getAllWedstrijden()
    .filter((w) => w.path && w.path !== "")
    .map((w) => w.path);
}
