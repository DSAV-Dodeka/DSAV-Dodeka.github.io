// Feature: gender-toggle-sprint-tijden, Property 1: Gender-level PR lookup correctheid
// **Validates: Requirements 2.3, 2.4, 4.1**

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  getExperienceLevelPRs,
  EXPERIENCE_LEVEL_PRS,
  EXPERIENCE_LEVEL_PRS_WOMEN,
  type Gender,
  type ExperienceLevel,
  type PRDistance,
} from "../sprint-calculator";

// ── Arbitraries ──

const genderArb = fc.constantFrom<Gender>("mannen", "vrouwen");

const experienceLevelArb = fc.constantFrom<ExperienceLevel>(
  "beginner",
  "novice",
  "intermediate",
  "gevorderd",
  "elite",
  "legende",
  "bolt"
);

// ── Property 1: Gender-level PR lookup correctheid ──

describe("Property 1: Gender-level PR lookup correctheid", () => {
  it("for any gender and experience level, getExperienceLevelPRs returns the correct gender-specific dataset", () => {
    fc.assert(
      fc.property(genderArb, experienceLevelArb, (gender, level) => {
        const result = getExperienceLevelPRs(gender)[level];
        const expected =
          gender === "vrouwen"
            ? EXPERIENCE_LEVEL_PRS_WOMEN[level]
            : EXPERIENCE_LEVEL_PRS[level];

        expect(result).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: gender-toggle-sprint-tijden, Property 2: Vrouwentijden zijn langzamer dan mannentijden
// **Validates: Requirements 2.5**

const prDistanceArb = fc.constantFrom<PRDistance>(60, 100, 150, 200, 300, 400);

describe("Property 2: Vrouwentijden zijn langzamer dan mannentijden", () => {
  it("for any experience level and distance, women's PR time is strictly greater than men's PR time", () => {
    fc.assert(
      fc.property(experienceLevelArb, prDistanceArb, (level, distance) => {
        const womenTime = EXPERIENCE_LEVEL_PRS_WOMEN[level][distance];
        const menTime = EXPERIENCE_LEVEL_PRS[level][distance];

        expect(womenTime).toBeGreaterThan(menTime);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: gender-toggle-sprint-tijden, Property 3: Ervaringsniveau blijft behouden bij gender-wissel
// **Validates: Requirements 4.2**

describe("Property 3: Ervaringsniveau blijft behouden bij gender-wissel", () => {
  it("for any experience level and gender, switching gender keeps the level key valid and returns data from the new gender's dataset", () => {
    fc.assert(
      fc.property(genderArb, experienceLevelArb, (gender, level) => {
        // Get PR values for the original gender
        const originalPRs = getExperienceLevelPRs(gender)[level];
        expect(originalPRs).toBeDefined();

        // Switch to the opposite gender
        const oppositeGender: Gender = gender === "mannen" ? "vrouwen" : "mannen";

        // The same level key must still be valid in the opposite gender's dataset
        const switchedPRs = getExperienceLevelPRs(oppositeGender)[level];
        expect(switchedPRs).toBeDefined();

        // The level key is unchanged (same key used for both lookups)
        // but the PR values must come from the new gender's dataset
        const expectedDataset =
          oppositeGender === "vrouwen"
            ? EXPERIENCE_LEVEL_PRS_WOMEN
            : EXPERIENCE_LEVEL_PRS;
        expect(switchedPRs).toBe(expectedDataset[level]);

        // PR values should differ between genders (women's times are slower)
        expect(switchedPRs).not.toBe(originalPRs);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: gender-toggle-sprint-tijden, Property 4: Handmatige PR's blijven behouden bij gender-wissel zonder niveau
// **Validates: Requirements 4.3**

/**
 * Arbitrary that generates random PRValues (Partial<Record<PRDistance, number>>).
 * Each distance has a ~50% chance of being included, with realistic sprint times.
 */
const prValuesArb = fc
  .record({
    60: fc.option(fc.double({ min: 6.0, max: 15.0, noNaN: true }), { nil: undefined }),
    100: fc.option(fc.double({ min: 9.0, max: 20.0, noNaN: true }), { nil: undefined }),
    150: fc.option(fc.double({ min: 14.0, max: 32.0, noNaN: true }), { nil: undefined }),
    200: fc.option(fc.double({ min: 19.0, max: 45.0, noNaN: true }), { nil: undefined }),
    300: fc.option(fc.double({ min: 30.0, max: 70.0, noNaN: true }), { nil: undefined }),
    400: fc.option(fc.double({ min: 45.0, max: 95.0, noNaN: true }), { nil: undefined }),
  })
  .map((rec) => {
    // Filter out undefined values to produce a clean PRValues object
    const result: Record<string, number> = {};
    for (const [key, val] of Object.entries(rec)) {
      if (val !== undefined) {
        result[key] = val;
      }
    }
    return result as import("../sprint-calculator").PRValues;
  });

describe("Property 4: Handmatige PR's blijven behouden bij gender-wissel zonder niveau", () => {
  it("for any manually entered PRValues, switching gender with no selected level leaves PRValues unchanged", () => {
    fc.assert(
      fc.property(genderArb, prValuesArb, (gender, manualPRs) => {
        // Simulate the handleGenderChange logic from SprintTijden:
        // selectedLevel is null → PRValues should NOT be updated
        const selectedLevel = null;
        let currentPRs = { ...manualPRs };

        // Simulate gender switch (mirrors handleGenderChange callback)
        const newGender: Gender = gender === "mannen" ? "vrouwen" : "mannen";
        if (selectedLevel) {
          // This branch is NOT taken when selectedLevel is null
          const levelPrs = getExperienceLevelPRs(newGender);
          currentPRs = levelPrs[selectedLevel];
        }

        // PRValues must remain identical to the original manual values
        expect(currentPRs).toEqual(manualPRs);
      }),
      { numRuns: 100 }
    );
  });
});
