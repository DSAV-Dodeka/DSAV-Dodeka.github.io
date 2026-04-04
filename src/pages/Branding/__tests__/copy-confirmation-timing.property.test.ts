// Feature: branding-page, Property 2: Copy confirmation timing
// **Validates: Requirements 2.4**

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as fc from "fast-check";
import { useClipboard } from "../hooks/useClipboard";

describe("Property 2: Copy confirmation timing", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock navigator.clipboard.writeText to resolve successfully
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("for any successful copy action, copied is true immediately and false after 2 seconds", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (text) => {
          const { result, unmount } = renderHook(() => useClipboard());

          // Before copy, copied should be false
          expect(result.current.copied).toBe(false);

          // Perform the copy action
          await act(async () => {
            await result.current.copy(text);
          });

          // Immediately after copy, copied should be true
          expect(result.current.copied).toBe(true);

          // Advance time by 1999ms — should still be true
          await act(async () => {
            vi.advanceTimersByTime(1999);
          });
          expect(result.current.copied).toBe(true);

          // Advance time by 1 more ms (total 2000ms) — should be false
          await act(async () => {
            vi.advanceTimersByTime(1);
          });
          expect(result.current.copied).toBe(false);

          // Clean up to avoid state leaking between iterations
          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });
});
