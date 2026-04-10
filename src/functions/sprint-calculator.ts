/** Afstanden waarvoor PR's ingevoerd kunnen worden */
export type PRDistance = 60 | 100 | 150 | 200 | 300 | 400;

/** Primaire afstanden (eerste invoeroptie) */
export const PRIMARY_DISTANCES: PRDistance[] = [60, 150, 300];

/** Secundaire afstanden (alternatieve invoeroptie) */
export const SECONDARY_DISTANCES: PRDistance[] = [100, 200, 400];

/** Alle standaard afstanden */
export const ALL_DISTANCES: PRDistance[] = [60, 100, 150, 200, 300, 400];

/** PR-waarden per afstand (null = niet ingevuld) */
export type PRValues = Partial<Record<PRDistance, number>>;

/** Gesorteerd PR-datapunt voor berekeningen */
export interface SortedPR {
  distance: number;
  time: number;
}

/** Ervaringsniveaus */
export type ExperienceLevel = 'beginner' | 'novice' | 'intermediate' | 'gevorderd' | 'elite' | 'legende' | 'bolt';

/** Referentie-PR's per ervaringsniveau */
export const EXPERIENCE_LEVEL_PRS: Record<ExperienceLevel, Record<PRDistance, number>> = {
  beginner:     { 60: 10.5, 100: 16.5, 150: 26.0, 200: 36.0, 300: 58.0, 400: 80.0 },
  novice:       { 60: 9.5, 100: 15.0, 150: 23.5, 200: 32.0, 300: 52.0, 400: 72.0 },
  intermediate: { 60: 8.8, 100: 13.5, 150: 21.0, 200: 29.0, 300: 47.0, 400: 66.0 },
  gevorderd:    { 60: 8.0, 100: 12.5, 150: 19.5, 200: 27.0, 300: 43.0, 400: 60.0 },
  elite:        { 60: 7.3, 100: 11.5, 150: 17.8, 200: 24.5, 300: 39.0, 400: 55.0 },
  legende:      { 60: 7.0, 100: 11.0, 150: 17.0, 200: 23.5, 300: 37.0, 400: 52.0 },
  bolt:         { 60: 6.31, 100: 9.58, 150: 14.35, 200: 19.19, 300: 30.5, 400: 45.35 },
};

/** Training run in het schema */
export interface TrainingRun {
  id: number;
  mode: 'distance' | 'duration';
  distance: number | null;
  duration: number | null;
  percentage: number;
}

/** Beschikbare preset afstanden voor distance mode */
export const PRESET_DISTANCES = [60, 80, 100, 120, 150, 180, 200, 250, 300, 400];

/** Beschikbare preset intensiteiten */
export const PRESET_PERCENTAGES = [100, 95, 90, 85, 80, 75, 70];

/** Riegel-exponent voor sprint-extrapolatie */
export const SPRINT_EXPONENT = 1.04;

/** Lineaire interpolatie tussen twee punten */
export function interpolate(x: number, x1: number, y1: number, x2: number, y2: number): number {
  return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
}

/**
 * Bereken de verwachte tijd voor een afstand op basis van bekende PR's.
 *
 * - Sorteer PR's op afstand
 * - Tussen twee bekende afstanden → lineaire interpolatie
 * - Buiten bereik → machtswet-extrapolatie (Riegel: T2 = T1 × (D2/D1)^k)
 * - Bij slechts één PR → machtswet-extrapolatie vanuit dat ene punt
 */
export function calculateTimeForDistance(targetDistance: number, prs: SortedPR[]): number {
  const sorted = [...prs].sort((a, b) => a.distance - b.distance);

  if (sorted.length === 0) {
    throw new Error('Minstens één PR is vereist');
  }

  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;

  // Eén PR: machtswet-extrapolatie vanuit dat ene punt
  if (sorted.length === 1) {
    return first.time * Math.pow(targetDistance / first.distance, SPRINT_EXPONENT);
  }

  // Exacte match
  const exact = sorted.find(pr => pr.distance === targetDistance);
  if (exact) {
    return exact.time;
  }

  // Buiten bereik links (korter dan kortste PR)
  if (targetDistance < first.distance) {
    return first.time * Math.pow(targetDistance / first.distance, SPRINT_EXPONENT);
  }

  // Buiten bereik rechts (langer dan langste PR)
  if (targetDistance > last.distance) {
    return last.time * Math.pow(targetDistance / last.distance, SPRINT_EXPONENT);
  }

  // Tussen twee bekende afstanden → lineaire interpolatie
  for (let i = 0; i < sorted.length - 1; i++) {
    const lower = sorted[i]!;
    const upper = sorted[i + 1]!;
    if (targetDistance >= lower.distance && targetDistance <= upper.distance) {
      return interpolate(
        targetDistance,
        lower.distance,
        lower.time,
        upper.distance,
        upper.time,
      );
    }
  }

  // Fallback (zou niet bereikt moeten worden)
  return last.time * Math.pow(targetDistance / last.distance, SPRINT_EXPONENT);
}

/**
 * Bereken doeltijd voor een afstand bij een gegeven intensiteitspercentage.
 * baseTime / (percentage / 100)
 */
export function calculateTargetTime(targetDistance: number, percentage: number, prs: SortedPR[]): number {
  const baseTime = calculateTimeForDistance(targetDistance, prs);
  return baseTime / (percentage / 100);
}

/** Rond af naar hele seconden */
export function roundToWholeSeconds(time: number): number {
  return Math.round(time);
}

/**
 * Bepaal het dichtstbijzijnde ervaringsniveau op basis van PR-waarden.
 * Vergelijkt de PR's van de gebruiker met elk niveau en kiest het niveau
 * met het kleinste totale verschil. Retourneert null als er geen PR's zijn.
 */
export function findClosestLevel(prValues: PRValues): ExperienceLevel | null {
  const entries = (Object.entries(prValues) as [string, number | undefined][])
    .filter((entry): entry is [string, number] => entry[1] != null);

  if (entries.length === 0) return null;

  const levels = Object.keys(EXPERIENCE_LEVEL_PRS) as ExperienceLevel[];
  let closestLevel: ExperienceLevel = levels[0]!;
  let smallestDiff = Infinity;

  for (const level of levels) {
    const levelPrs = EXPERIENCE_LEVEL_PRS[level];
    let totalDiff = 0;

    for (const [distStr, userTime] of entries) {
      const dist = Number(distStr) as PRDistance;
      const levelTime = levelPrs[dist];
      if (levelTime != null) {
        totalDiff += Math.abs(userTime - levelTime);
      }
    }

    if (totalDiff < smallestDiff) {
      smallestDiff = totalDiff;
      closestLevel = level;
    }
  }

  return closestLevel;
}

/** Haal PR-waarden op voor een ervaringsniveau */
export function getLevelPRs(level: ExperienceLevel): PRValues {
  return EXPERIENCE_LEVEL_PRS[level];
}

/**
 * Schat de afstand die gelopen kan worden in een gegeven duur (in seconden),
 * op basis van bekende PR's. Gebruikt binary search op calculateTimeForDistance.
 */
export function calculateDistanceForDuration(targetDuration: number, prs: SortedPR[]): number {
  if (prs.length === 0) {
    throw new Error('Minstens één PR is vereist');
  }

  // Binary search: zoek de afstand waarvoor calculateTimeForDistance ≈ targetDuration
  let low = 1;
  let high = 1000;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const time = calculateTimeForDistance(mid, prs);

    if (Math.abs(time - targetDuration) < 0.001) {
      return mid;
    }

    if (time < targetDuration) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/** Converteer PRValues naar SortedPR[] gesorteerd op afstand */
export function prValuesToSortedPRs(prValues: PRValues): SortedPR[] {
  return (Object.entries(prValues) as [string, number | undefined][])
    .filter((entry): entry is [string, number] => entry[1] != null)
    .map(([distStr, time]) => ({ distance: Number(distStr), time }))
    .sort((a, b) => a.distance - b.distance);
}
