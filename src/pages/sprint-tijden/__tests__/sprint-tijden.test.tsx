import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DoeltijdenOverzicht from "../components/DoeltijdenOverzicht";
import NiveauEnPRInvoer from "../components/NiveauEnPRInvoer";
import ReferentieTabel from "../components/ReferentieTabel";
import { EXPERIENCE_LEVEL_PRS, ALL_DISTANCES } from "../../../functions/sprint-calculator";
import type { TrainingRun, PRValues } from "../../../functions/sprint-calculator";

afterEach(() => {
  cleanup();
});

// ── DoeltijdenOverzicht ──

describe("DoeltijdenOverzicht", () => {
  it("shows placeholder when no PR data is available", () => {
    const runs: TrainingRun[] = [
      { id: 1, mode: "distance", distance: 100, duration: null, percentage: 85 },
    ];

    render(
      <DoeltijdenOverzicht runs={runs} prValues={{}} hasPRData={false} />
    );

    expect(
      screen.getByText(
        "Vul je PR's in of selecteer je niveau om je doeltijden te zien"
      )
    ).toBeVisible();
  });
});

// ── NiveauEnPRInvoer ──

describe("NiveauEnPRInvoer", () => {
  it("calls onSelectLevel with 'intermediate' when Intermediate button is clicked", async () => {
    const user = userEvent.setup();
    const onSelectLevel = vi.fn();
    const onPRChange = vi.fn();

    render(
      <NiveauEnPRInvoer
        selectedLevel={null}
        prValues={{}}
        onSelectLevel={onSelectLevel}
        onPRChange={onPRChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Groeiend Talent" }));
    expect(onSelectLevel).toHaveBeenCalledWith("intermediate");
  });

  it("calls onPRChange when a PR input is manually changed after level selection", async () => {
    const user = userEvent.setup();
    const onSelectLevel = vi.fn();
    const onPRChange = vi.fn();

    const intermediatePRs: PRValues = { ...EXPERIENCE_LEVEL_PRS.intermediate };

    const { container } = render(
      <NiveauEnPRInvoer
        selectedLevel="intermediate"
        prValues={intermediatePRs}
        onSelectLevel={onSelectLevel}
        onPRChange={onPRChange}
      />
    );

    // Verify the component renders with level selected
    const section = container.querySelector(".niveau-pr-invoer")!;
    const intermediateBtn = within(section as HTMLElement).getByRole("button", {
      name: "Groeiend Talent",
    });
    expect(intermediateBtn.className).toContain("niveau-btn--active");

    // Verify the 60m input exists and has the correct HTML value attribute
    const input60m = within(section as HTMLElement).getByLabelText(
      "60m"
    ) as HTMLInputElement;
    expect(input60m.type).toBe("number");
    expect(input60m.getAttribute("value")).toBe("8.8");

    // Type a new integer value (jsdom number inputs don't support decimal typing)
    await user.click(input60m);
    await user.keyboard("{Control>}a{/Control}9");

    // Verify onPRChange was called with the manual value
    expect(onPRChange).toHaveBeenCalledWith(60, 9);
  });
});

// ── ReferentieTabel ──

describe("ReferentieTabel", () => {
  it("is always visible with tooltip trigger and standard distance rows in popup", () => {
    const { container } = render(
      <ReferentieTabel runs={[]} selectedLevel={null} userPRValues={{}} />
    );

    expect(screen.getByText(/PR Referentie per niveau/)).toBeInTheDocument();

    // All standard distances should be rendered in the PR reference table (inside popup)
    const cells = container.querySelectorAll("td.referentie-tabel__cell");
    for (const distance of ALL_DISTANCES) {
      const distanceCell = Array.from(cells).find(
        (td) => td.textContent === `${distance}m`
      );
      expect(distanceCell).toBeTruthy();
    }
  });
});
