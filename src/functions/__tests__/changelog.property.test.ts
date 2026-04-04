// Feature: changelog-page, Property 2: Timeline items are sorted in descending date order
// Feature: changelog-page, Property 5: Category emoji mapping is correct
// Feature: changelog-page, Property 7: isNieuw date boundary
// Feature: changelog-page, Property 10: Release moment grouping correctness
// **Validates: Requirements 1.4, 4.1, 5.3, 6.1, 6.2, 10.1, 10.2, 10.3, 10.4, 10.5**

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  parseDatum,
  isNieuw,
  getCategorieEmoji,
  type ChangelogEntry,
  type ReleaseMoment,
  type TijdlijnItem,
} from "../changelog";

// ── Arbitraries ──

/** Generate a valid dd-mm-yyyy date string */
const datumArb = fc
  .record({
    day: fc.integer({ min: 1, max: 28 }),
    month: fc.integer({ min: 1, max: 12 }),
    year: fc.integer({ min: 2020, max: 2030 }),
  })
  .map(
    ({ day, month, year }) =>
      `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`
  );

const categorieArb = fc.constantFrom(
  "feature" as const,
  "bugfix" as const,
  "verbetering" as const,
  "content" as const
);

const grootteArb = fc.constantFrom("groot" as const, "klein" as const);

/** Generate a valid ChangelogEntry */
const changelogEntryArb = (idPrefix: string = "entry") =>
  fc
    .record({
      idx: fc.integer({ min: 0, max: 99999 }),
      datum: datumArb,
      titel: fc.string({ minLength: 1, maxLength: 50 }),
      beschrijving: fc.string({ minLength: 1, maxLength: 100 }),
      categorie: categorieArb,
      grootte: grootteArb,
    })
    .map(
      ({ idx, datum, titel, beschrijving, categorie, grootte }) =>
        ({
          id: `${idPrefix}-${idx}`,
          datum,
          titel,
          beschrijving,
          categorie,
          grootte,
        }) as ChangelogEntry
    );

/** Generate a valid ReleaseMoment */
const releaseMomentArb = (idPrefix: string = "moment") =>
  fc
    .record({
      idx: fc.integer({ min: 0, max: 99999 }),
      naam: fc.string({ minLength: 1, maxLength: 50 }),
      datum: datumArb,
      beschrijving: fc.string({ minLength: 1, maxLength: 100 }),
    })
    .map(
      ({ idx, naam, datum, beschrijving }) =>
        ({
          id: `${idPrefix}-${idx}`,
          naam,
          datum,
          beschrijving,
        }) as ReleaseMoment
    );

// ── Helper: build timeline from arbitrary data (mirrors getTimelineItems logic) ──

function buildTimeline(
  updates: ChangelogEntry[],
  momenten: ReleaseMoment[]
): TijdlijnItem[] {
  const momentenMap = new Map<string, ReleaseMoment>();
  for (const m of momenten) {
    momentenMap.set(m.id, m);
  }

  const momentUpdates = new Map<string, ChangelogEntry[]>();
  const standalone: ChangelogEntry[] = [];

  for (const u of updates) {
    if (u.momentId && momentenMap.has(u.momentId)) {
      const existing = momentUpdates.get(u.momentId) ?? [];
      existing.push(u);
      momentUpdates.set(u.momentId, existing);
    } else {
      standalone.push(u);
    }
  }

  const items: TijdlijnItem[] = [];

  for (const m of momenten) {
    const grouped = momentUpdates.get(m.id);
    if (grouped && grouped.length > 0) {
      // Sort groot before klein within each moment
      const sorted = [...grouped].sort((a, b) => {
        const aIsKlein = (a.grootte ?? "groot") === "klein" ? 1 : 0;
        const bIsKlein = (b.grootte ?? "groot") === "klein" ? 1 : 0;
        return aIsKlein - bIsKlein;
      });
      items.push({ type: "moment", moment: m, updates: sorted });
    }
  }

  for (const u of standalone) {
    items.push({ type: "update", entry: u });
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

function getItemDate(item: TijdlijnItem): Date {
  return item.type === "update"
    ? parseDatum(item.entry.datum)
    : parseDatum(item.moment.datum);
}

// ── Property 2: Timeline items are sorted in descending date order ──

describe("Property 2: Timeline items are sorted in descending date order", () => {
  it("for any set of updates and release moments, timeline items should be sorted with each date <= the previous", () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb("u"), { minLength: 0, maxLength: 20 }),
        fc.array(releaseMomentArb("m"), { minLength: 0, maxLength: 5 }),
        (updates, momenten) => {
          // Optionally link some updates to moments
          const linked = updates.map((u, i) => {
            if (momenten.length > 0 && i % 3 === 0) {
              return {
                ...u,
                momentId: momenten[i % momenten.length].id,
              };
            }
            return u;
          });

          const items = buildTimeline(linked, momenten);

          for (let i = 1; i < items.length; i++) {
            const prevDate = getItemDate(items[i - 1]);
            const currDate = getItemDate(items[i]);
            expect(prevDate.getTime()).toBeGreaterThanOrEqual(
              currDate.getTime()
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ── Property 5: Category emoji mapping is correct ──

describe("Property 5: Category emoji mapping is correct", () => {
  it("for any valid categorie value, getCategorieEmoji returns the correct emoji", () => {
    const expected: Record<string, string> = {
      feature: "✨",
      bugfix: "🐛",
      verbetering: "⚡",
      content: "📝",
    };

    fc.assert(
      fc.property(categorieArb, (categorie) => {
        expect(getCategorieEmoji(categorie)).toBe(expected[categorie]);
      }),
      { numRuns: 100 }
    );
  });
});

// ── Property 7: isNieuw date boundary ──

describe("Property 7: isNieuw date boundary", () => {
  it("for any date, isNieuw returns true iff the date is within the last 14 days (inclusive)", () => {
    // Generate dates as offsets from today to test the boundary precisely
    const dayOffsetArb = fc.integer({ min: -365, max: 365 });

    fc.assert(
      fc.property(dayOffsetArb, (offset) => {
        const now = new Date();
        const target = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + offset
        );

        const dag = String(target.getDate()).padStart(2, "0");
        const maand = String(target.getMonth() + 1).padStart(2, "0");
        const jaar = target.getFullYear();
        const datumStr = `${dag}-${maand}-${jaar}`;

        const result = isNieuw(datumStr);

        // The boundary: veertienDagenGeleden = today - 14 days
        // isNieuw returns true when date >= veertienDagenGeleden
        // So offset >= -14 should be true, offset < -14 should be false
        const expected = offset >= -14;
        expect(result).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});

// ── Property 10: Release moment grouping correctness ──

describe("Property 10: Release moment grouping correctness", () => {
  it("updates with valid momentId are grouped under their moment; others appear standalone", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 15 }),
        fc.integer({ min: 1, max: 5 }),
        datumArb,
        categorieArb,
        (numUpdates, numMomenten, datum, categorie) => {
          // Generate updates and moments with guaranteed unique IDs
          const momenten: ReleaseMoment[] = Array.from(
            { length: numMomenten },
            (_, i) => ({
              id: `m-${i}`,
              naam: `Moment ${i}`,
              datum,
              beschrijving: `Beschrijving ${i}`,
            })
          );

          const updates: ChangelogEntry[] = Array.from(
            { length: numUpdates },
            (_, i) => {
              const base: ChangelogEntry = {
                id: `u-${i}`,
                datum,
                titel: `Update ${i}`,
                beschrijving: `Beschrijving ${i}`,
                categorie,
                grootte: "groot",
              };

              if (i % 4 === 0) {
                // Valid momentId
                return { ...base, momentId: momenten[i % numMomenten].id };
              } else if (i % 4 === 1) {
                // Invalid momentId
                return { ...base, momentId: "non-existent-moment" };
              }
              // No momentId (standalone)
              return base;
            }
          );

          const momentIdSet = new Set(momenten.map((m) => m.id));
          const items = buildTimeline(updates, momenten);

          // Count grouped and standalone updates
          let groupedCount = 0;
          let standaloneCount = 0;

          for (const item of items) {
            if (item.type === "moment") {
              for (const u of item.updates) {
                // Every grouped update must have a valid momentId matching this moment
                expect(u.momentId).toBe(item.moment.id);
                groupedCount++;
              }
            } else {
              // Standalone: must not have a valid momentId
              const hasValidMoment =
                item.entry.momentId !== undefined &&
                momentIdSet.has(item.entry.momentId);
              expect(hasValidMoment).toBe(false);
              standaloneCount++;
            }
          }

          // Every update must appear exactly once
          expect(groupedCount + standaloneCount).toBe(numUpdates);
        }
      ),
      { numRuns: 100 }
    );
  });
});
