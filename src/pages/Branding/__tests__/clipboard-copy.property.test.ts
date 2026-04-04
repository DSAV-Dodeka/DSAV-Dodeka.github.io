// Feature: branding-page, Property 1: Clipboard copy correctness
// **Validates: Requirements 2.3**

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as fc from "fast-check";
import { useClipboard } from "../hooks/useClipboard";

/**
 * Arbitrary that generates a ColorInfo-shaped object with random strings
 * for name, hex, rgb, cmyk, and pantone fields.
 */
const colorInfoArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  hex: fc.string({ minLength: 1, maxLength: 20 }),
  rgb: fc.string({ minLength: 1, maxLength: 40 }),
  cmyk: fc.string({ minLength: 1, maxLength: 40 }),
  pantone: fc.string({ minLength: 1, maxLength: 30 }),
});

/**
 * Arbitrary that picks one of the color value keys.
 */
const colorKeyArb = fc.constantFrom(
  "hex" as const,
  "rgb" as const,
  "cmyk" as const,
  "pantone" as const,
);

describe("Property 1: Clipboard copy correctness", () => {
  let clipboardWritten: string | undefined;

  beforeEach(() => {
    clipboardWritten = undefined;

    // Mock navigator.clipboard.writeText to capture what was written
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn((text: string) => {
          clipboardWritten = text;
          return Promise.resolve();
        }),
      },
    });
  });

  it("for any ColorInfo and any value key, copy writes the exact value to the clipboard", async () => {
    await fc.assert(
      fc.asyncProperty(colorInfoArb, colorKeyArb, async (color, key) => {
        const expectedValue = color[key];

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
          await result.current.copy(expectedValue);
        });

        expect(clipboardWritten).toBe(expectedValue);
      }),
      { numRuns: 100 },
    );
  });
});
