// Feature: branding-page, Property 3: Format picker displays selected logo name
// **Validates: Requirements 4.4**

import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import FormatPicker from "../components/FormatPicker";

afterEach(() => {
  cleanup();
});

/**
 * Arbitrary that generates a non-empty, non-whitespace-only logo name.
 * Real logo names always contain visible characters.
 */
const logoNameArb = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

const logoIdArb = fc.string({ minLength: 1, maxLength: 50 });

const colorVariantArb = fc.constantFrom("dark" as const, "white" as const);

describe("Property 3: Format picker displays selected logo name", () => {
  it("for any logo variant name and color variant, the format picker should display that logo name", () => {
    fc.assert(
      fc.property(
        logoNameArb,
        logoIdArb,
        colorVariantArb,
        (logoName, logoId, colorVariant) => {
          const { container, unmount } = render(
            <FormatPicker
              logoName={logoName}
              logoId={logoId}
              colorVariant={colorVariant}
            />
          );

          const heading = container.querySelector(".format-picker__heading");
          expect(heading).not.toBeNull();
          expect(heading!.textContent).toBe(logoName);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
