import ChangelogData from "../content/Changelog.json";

export interface ChangelogEntry {
  id: string;
  datum: string;
  titel: string;
  beschrijving: string;
  categorie: "feature" | "bugfix" | "verbetering" | "content";
  grootte?: "groot" | "klein";
  link?: string;
  afbeelding?: string;
  auteur?: string;
  versie?: string;
  momentId?: string;
}

export interface ReleaseMoment {
  id: string;
  naam: string;
  datum: string;
  beschrijving: string;
}

export type TijdlijnItem =
  | { type: "update"; entry: ChangelogEntry }
  | { type: "moment"; moment: ReleaseMoment; updates: ChangelogEntry[] };

/**
 * Parse a dd-mm-yyyy date string into a Date object.
 */
export function parseDatum(datum: string): Date {
  const [dag, maand, jaar] = datum.split("-");
  return new Date(Number(jaar), Number(maand) - 1, Number(dag));
}

/**
 * Returns true if the given dd-mm-yyyy date is less than 14 days ago.
 */
export function isNieuw(datum: string): boolean {
  const date = parseDatum(datum);
  const now = new Date();
  const veertienDagenGeleden = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 14
  );
  return date >= veertienDagenGeleden;
}

/**
 * Map a categorie string to its corresponding emoji.
 */
export function getCategorieEmoji(categorie: string): string {
  switch (categorie) {
    case "feature":
      return "✨";
    case "bugfix":
      return "🐛";
    case "verbetering":
      return "⚡";
    case "content":
      return "📝";
    default:
      return "";
  }
}

/**
 * Get all updates sorted by date descending. Defaults grootte to "groot" when missing.
 */
export function getAllUpdates(): ChangelogEntry[] {
  const updates: ChangelogEntry[] = (
    ChangelogData.updates as ChangelogEntry[]
  ).map((entry) => ({
    ...entry,
    grootte: entry.grootte ?? "groot",
  }));

  return updates.sort(
    (a, b) => parseDatum(b.datum).getTime() - parseDatum(a.datum).getTime()
  );
}

/**
 * Get all release moments.
 */
export function getAllMomenten(): ReleaseMoment[] {
  return ChangelogData.momenten as ReleaseMoment[];
}

/**
 * Get a combined timeline of standalone updates and release moments with their grouped updates,
 * sorted by date descending, groot before klein within the same date.
 *
 * Updates with a valid momentId (matching an existing ReleaseMoment) are grouped under that moment.
 * Updates without a momentId, or with a momentId that doesn't match any moment, appear as standalone items.
 */
export function getTimelineItems(): TijdlijnItem[] {
  const momenten = getAllMomenten();
  const momentenMap = new Map<string, ReleaseMoment>();
  for (const moment of momenten) {
    momentenMap.set(moment.id, moment);
  }

  const updates = getAllUpdates();

  // Group updates by their momentId (only if the moment exists)
  const momentUpdates = new Map<string, ChangelogEntry[]>();
  const standaloneUpdates: ChangelogEntry[] = [];

  for (const update of updates) {
    if (update.momentId && momentenMap.has(update.momentId)) {
      const existing = momentUpdates.get(update.momentId) ?? [];
      existing.push(update);
      momentUpdates.set(update.momentId, existing);
    } else {
      standaloneUpdates.push(update);
    }
  }

  const items: TijdlijnItem[] = [];

  // Add release moments with their grouped updates (groot before klein)
  for (const moment of momenten) {
    const grouped = momentUpdates.get(moment.id);
    if (grouped && grouped.length > 0) {
      const sorted = [...grouped].sort((a, b) => {
        const aIsKlein = a.grootte === "klein" ? 1 : 0;
        const bIsKlein = b.grootte === "klein" ? 1 : 0;
        return aIsKlein - bIsKlein;
      });
      items.push({ type: "moment", moment, updates: sorted });
    }
  }

  // Add standalone updates
  for (const update of standaloneUpdates) {
    items.push({ type: "update", entry: update });
  }

  // Sort all items by date descending
  items.sort((a, b) => {
    const dateA =
      a.type === "update"
        ? parseDatum(a.entry.datum)
        : parseDatum(a.moment.datum);
    const dateB =
      b.type === "update"
        ? parseDatum(b.entry.datum)
        : parseDatum(b.moment.datum);
    return dateB.getTime() - dateA.getTime();
  });

  return items;
}
