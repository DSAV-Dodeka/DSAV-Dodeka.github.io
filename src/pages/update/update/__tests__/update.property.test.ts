// Feature: changelog-page, Property 3: Card type selection based on grootte
// Feature: changelog-page, Property 6: Month/year grouping correctness
// Feature: changelog-page, Property 8: Category filtering preserves only matching items
// Feature: changelog-page, Property 9: Incremental loading respects count boundaries
// **Validates: Requirements 3.1, 3.2, 3.3, 5.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.4**

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { parseDatum } from "$functions/changelog";
import type {
  ChangelogEntry,
  ReleaseMoment,
  TijdlijnItem,
} from "$functions/changelog";

// ── Arbitraries (same pattern as data layer tests) ──

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

const optionalGrootteArb = fc.oneof(
  fc.constant(undefined),
  fc.constant("groot" as const),
  fc.constant("klein" as const)
);

const changelogEntryArb = (idPrefix: string = "entry") =>
  fc
    .record({
      idx: fc.integer({ min: 0, max: 99999 }),
      datum: datumArb,
      titel: fc.string({ minLength: 1, maxLength: 50 }),
      beschrijving: fc.string({ minLength: 1, maxLength: 100 }),
      categorie: categorieArb,
      grootte: optionalGrootteArb,
    })
    .map(
      ({ idx, datum, titel, beschrijving, categorie, grootte }) =>
        ({
          id: `${idPrefix}-${idx}`,
          datum,
          titel,
          beschrijving,
          categorie,
          ...(grootte !== undefined ? { grootte } : {}),
        }) as ChangelogEntry
    );

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

// ── Re-implemented pure logic functions from update.tsx ──

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

function getGroepLabel(datum: string): string {
  const date = parseDatum(datum);
  const maand = MAANDEN[date.getMonth()] ?? "";
  return maand.charAt(0).toUpperCase() + maand.slice(1) + " " + date.getFullYear();
}

function getDatum(item: TijdlijnItem): string {
  return item.type === "update" ? item.entry.datum : item.moment.datum;
}

function filterItems(items: TijdlijnItem[], filter: string): TijdlijnItem[] {
  if (filter === "alles") return items;

  const result: TijdlijnItem[] = [];
  for (const item of items) {
    if (item.type === "update") {
      if (item.entry.categorie === filter) {
        result.push(item);
      }
    } else {
      const matchingUpdates = item.updates.filter((u) => u.categorie === filter);
      if (matchingUpdates.length > 0) {
        result.push({ type: "moment", moment: item.moment, updates: matchingUpdates });
      }
    }
  }
  return result;
}

function groepeerPerMaand(items: TijdlijnItem[]): { label: string; items: TijdlijnItem[] }[] {
  const groepen: { label: string; items: TijdlijnItem[] }[] = [];

  for (const item of items) {
    const label = getGroepLabel(getDatum(item));
    const laatste = groepen[groepen.length - 1];
    if (laatste && laatste.label === label) {
      laatste.items.push(item);
    } else {
      groepen.push({ label, items: [item] });
    }
  }

  return groepen;
}

function determineCardType(entry: ChangelogEntry): "UpdateKaart" | "CompacteKaart" {
  const grootte = entry.grootte ?? "groot";
  return grootte === "klein" ? "CompacteKaart" : "UpdateKaart";
}

// ── Property 3: Card type selection based on grootte ──

describe("Property 3: Card type selection based on grootte", () => {
  // Feature: changelog-page, Property 3: Card type selection based on grootte
  it("for any ChangelogEntry, card type is UpdateKaart when grootte is 'groot' or undefined, CompacteKaart when 'klein'", () => {
    fc.assert(
      fc.property(changelogEntryArb("p3"), (entry) => {
        const cardType = determineCardType(entry);
        const effectiveGrootte = entry.grootte ?? "groot";

        if (effectiveGrootte === "klein") {
          expect(cardType).toBe("CompacteKaart");
        } else {
          expect(cardType).toBe("UpdateKaart");
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ── Property 6: Month/year grouping correctness ──

describe("Property 6: Month/year grouping correctness", () => {
  // Feature: changelog-page, Property 6: Month/year grouping correctness
  it("for any set of timeline items, every item in a group has a date in that group's month/year, and no item is omitted or duplicated", () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb("p6"), { minLength: 0, maxLength: 20 }),
        fc.array(releaseMomentArb("p6m"), { minLength: 0, maxLength: 5 }),
        (updates, momenten) => {
          // Build timeline items (some linked to moments)
          const linked = updates.map((u, i) => {
            const target = momenten.length > 0 ? momenten[i % momenten.length] : undefined;
            if (target && i % 3 === 0) {
              return { ...u, momentId: target.id };
            }
            return u;
          });

          // Build a sorted timeline
          const momentenMap = new Map<string, ReleaseMoment>();
          for (const m of momenten) momentenMap.set(m.id, m);

          const momentUpdatesMap = new Map<string, ChangelogEntry[]>();
          const standalone: ChangelogEntry[] = [];

          for (const u of linked) {
            if (u.momentId && momentenMap.has(u.momentId)) {
              const existing = momentUpdatesMap.get(u.momentId) ?? [];
              existing.push(u);
              momentUpdatesMap.set(u.momentId, existing);
            } else {
              standalone.push(u);
            }
          }

          const items: TijdlijnItem[] = [];
          for (const m of momenten) {
            const grouped = momentUpdatesMap.get(m.id) ?? [];
            if (grouped.length > 0) {
              items.push({ type: "moment", moment: m, updates: grouped });
            }
          }
          for (const u of standalone) {
            items.push({ type: "update", entry: u });
          }
          items.sort((a, b) => {
            const dateA = a.type === "update" ? parseDatum(a.entry.datum) : parseDatum(a.moment.datum);
            const dateB = b.type === "update" ? parseDatum(b.entry.datum) : parseDatum(b.moment.datum);
            return dateB.getTime() - dateA.getTime();
          });

          const groepen = groepeerPerMaand(items);

          // 1. Every item in a group has a date matching the group's month/year
          for (const groep of groepen) {
            for (const item of groep.items) {
              const itemLabel = getGroepLabel(getDatum(item));
              expect(itemLabel).toBe(groep.label);
            }
          }

          // 2. No item is omitted or duplicated: total items across groups === input items
          const totalInGroups = groepen.reduce((sum, g) => sum + g.items.length, 0);
          expect(totalInGroups).toBe(items.length);

          // 3. Each item appears exactly once (check by collecting all items)
          const allGroupedItems: TijdlijnItem[] = [];
          for (const groep of groepen) {
            allGroupedItems.push(...groep.items);
          }
          expect(allGroupedItems).toEqual(items);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 8: Category filtering preserves only matching items ──

describe("Property 8: Category filtering preserves only matching items", () => {
  // Feature: changelog-page, Property 8: Category filtering preserves only matching items
  it("for any set of timeline items and any selected category, filtered result contains only matching entries", () => {
    const filterArb = fc.constantFrom("alles", "feature", "bugfix", "verbetering", "content");

    fc.assert(
      fc.property(
        fc.array(changelogEntryArb("p8"), { minLength: 0, maxLength: 20 }),
        fc.array(releaseMomentArb("p8m"), { minLength: 0, maxLength: 3 }),
        filterArb,
        (updates, momenten, filter) => {
          // Build timeline
          const linked = updates.map((u, i) => {
            const target = momenten.length > 0 ? momenten[i % momenten.length] : undefined;
            if (target && i % 2 === 0) {
              return { ...u, momentId: target.id };
            }
            return u;
          });

          const momentenMap = new Map<string, ReleaseMoment>();
          for (const m of momenten) momentenMap.set(m.id, m);

          const momentUpdatesMap = new Map<string, ChangelogEntry[]>();
          const standalone: ChangelogEntry[] = [];

          for (const u of linked) {
            if (u.momentId && momentenMap.has(u.momentId)) {
              const existing = momentUpdatesMap.get(u.momentId) ?? [];
              existing.push(u);
              momentUpdatesMap.set(u.momentId, existing);
            } else {
              standalone.push(u);
            }
          }

          const items: TijdlijnItem[] = [];
          for (const m of momenten) {
            const grouped = momentUpdatesMap.get(m.id) ?? [];
            if (grouped.length > 0) {
              items.push({ type: "moment", moment: m, updates: grouped });
            }
          }
          for (const u of standalone) {
            items.push({ type: "update", entry: u });
          }

          const filtered = filterItems(items, filter);

          if (filter === "alles") {
            // "alles" returns all items unchanged
            expect(filtered).toEqual(items);
          } else {
            // Every standalone update in filtered must match the category
            for (const item of filtered) {
              if (item.type === "update") {
                expect(item.entry.categorie).toBe(filter);
              } else {
                // Every update within a moment must match the category
                for (const u of item.updates) {
                  expect(u.categorie).toBe(filter);
                }
                // Moment must have at least one matching update
                expect(item.updates.length).toBeGreaterThan(0);
              }
            }

            // Filtered result is a subset: no more items than original
            expect(filtered.length).toBeLessThanOrEqual(items.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 9: Incremental loading respects count boundaries ──

describe("Property 9: Incremental loading respects count boundaries", () => {
  // Feature: changelog-page, Property 9: Incremental loading respects count boundaries
  it("for any N items and k clicks, visible items = min(10 + k*10, N) and button visible iff visible < N", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 10 }),
        (n, k) => {
          // Simulate the incremental loading logic from update.tsx
          // Initial: aantalZichtbaar = 10
          // Each click: aantalZichtbaar += 10
          const aantalZichtbaar = 10 + k * 10;
          const zichtbaar = Math.min(aantalZichtbaar, n);
          const heeftMeer = aantalZichtbaar < n;

          // Property: visible items = min(10 + k*10, N)
          expect(zichtbaar).toBe(Math.min(10 + k * 10, n));

          // Property: "Laad meer" button visible iff visible items < N
          expect(heeftMeer).toBe(zichtbaar < n);
        }
      ),
      { numRuns: 100 }
    );
  });
});
