// Feature: branding-page, Property 4: Download path construction
// **Validates: Requirements 4.6**

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { buildDownloadPath } from "../components/FormatPicker";

describe("Property 4: Download path construction", () => {
  const colorVariantArb = fc.constantFrom("dark", "white");
  const formatArb = fc.constantFrom("svg", "png", "ai", "eps");
  const logoIdArb = fc.string({ minLength: 1, maxLength: 50 });

  it("for any logo ID, color variant, and format, the download path equals /branding/{logoId}/{logoId}-{colorVariant}.{format}", () => {
    fc.assert(
      fc.property(logoIdArb, colorVariantArb, formatArb, (logoId, colorVariant, format) => {
        const result = buildDownloadPath(logoId, colorVariant, format);
        const expected = `/branding/${logoId}/${logoId}-${colorVariant}.${format}`;
        expect(result).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });
});
