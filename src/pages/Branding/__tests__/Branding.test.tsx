import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Branding from "../Branding";
import ColorPalette from "../components/ColorPalette";
import Typography from "../components/Typography";
import LogoSection, { LOGO_VARIANTS } from "../components/LogoSection";
import FormatPicker, {
  DOWNLOAD_FORMATS,
  buildDownloadPath,
} from "../components/FormatPicker";
import CrapRules from "../components/CrapRules";
import BrandHistory from "../components/BrandHistory";
import Introduction from "../components/Introduction";
import DesignTips from "../components/DesignTips";

// Mock HTMLDialogElement methods since jsdom doesn't support them
beforeEach(() => {
  HTMLDialogElement.prototype.showModal =
    HTMLDialogElement.prototype.showModal ||
    vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
  HTMLDialogElement.prototype.close =
    HTMLDialogElement.prototype.close ||
    vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });

  // Reset mocks
  vi.restoreAllMocks();

  // Mock showModal/close fresh each test
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (
    this: HTMLDialogElement
  ) {
    this.removeAttribute("open");
  });

  // Mock clipboard
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

// 1. Route rendering
describe("Branding page route rendering", () => {
  it("renders PageTitle with 'HUISSTIJL'", () => {
    render(
      <MemoryRouter>
        <Branding />
      </MemoryRouter>
    );
    expect(screen.getByText("HUISSTIJL")).toBeInTheDocument();
  });
});

// 2. Color palette
describe("ColorPalette", () => {
  it("displays all 5 colors with names and hex values", () => {
    render(<ColorPalette />);

    expect(screen.getByText("Dodeka Blauw")).toBeInTheDocument();
    expect(screen.getByText(/\#001D48/)).toBeInTheDocument();

    expect(screen.getByText("Baan Rood")).toBeInTheDocument();
    expect(screen.getByText(/\#BB4B3D/)).toBeInTheDocument();

    expect(screen.getByText("Wit")).toBeInTheDocument();
    expect(screen.getByText(/\#FFFFFF/)).toBeInTheDocument();

    expect(screen.getByText("TU Blauw")).toBeInTheDocument();
    expect(screen.getByText(/\#00A6D6/)).toBeInTheDocument();

    expect(screen.getByText("Team NL Oranje")).toBeInTheDocument();
    expect(screen.getByText(/\#FF914D/)).toBeInTheDocument();
  });
});

// 3. Typography
describe("Typography", () => {
  it("displays font names and weights", () => {
    render(<Typography />);

    expect(screen.getByText(/Montserrat Black/)).toBeInTheDocument();
    // "Montserrat Bold" appears in both description and example link
    expect(screen.getAllByText(/Montserrat Bold/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Source Sans 3/).length).toBeGreaterThanOrEqual(1);
  });

  it("has Google Fonts links with correct hrefs", () => {
    render(<Typography />);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain(
      "https://fonts.google.com/specimen/Montserrat"
    );
    expect(hrefs).toContain(
      "https://fonts.google.com/specimen/Source+Sans+3"
    );
  });
});

// 4. Logo section
describe("LogoSection", () => {
  it("displays all 3 variant names", () => {
    const onLogoClick = vi.fn();
    render(<LogoSection onLogoClick={onLogoClick} />);

    expect(screen.getAllByText(/Elongated Logo/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Upright Full Logo/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Monogram/).length).toBeGreaterThan(0);
  });

  it("shows both dark and white versions with labels", () => {
    const onLogoClick = vi.fn();
    render(<LogoSection onLogoClick={onLogoClick} />);

    expect(screen.getAllByText(/\(Donkerblauw\)/).length).toBe(3);
    expect(screen.getAllByText(/\(Wit\)/).length).toBe(3);
  });
});

// 5. Modal opens on logo click
describe("Branding modal interaction", () => {
  it("opens the format picker modal when a logo preview is clicked", () => {
    render(
      <MemoryRouter>
        <Branding />
      </MemoryRouter>
    );

    // Click the first logo preview (dark variant of Elongated Logo)
    const firstLogoButton = screen.getByLabelText(
      "Download Elongated Logo (Donkerblauw)"
    );
    fireEvent.click(firstLogoButton);

    // The dialog's showModal should have been called
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });
});

// 6. Format picker
describe("FormatPicker", () => {
  it("shows SVG, PNG, AI, EPS format options", () => {
    render(
      <FormatPicker
        logoName="Test Logo"
        logoId="test"
        colorVariant="dark"
      />
    );

    DOWNLOAD_FORMATS.forEach((fmt) => {
      expect(screen.getByText(fmt.toUpperCase())).toBeInTheDocument();
    });
  });

  it("renders download links with correct href attributes", () => {
    render(
      <FormatPicker
        logoName="Test Logo"
        logoId="elongated"
        colorVariant="dark"
      />
    );

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    DOWNLOAD_FORMATS.forEach((fmt) => {
      const expected = buildDownloadPath("elongated", "dark", fmt);
      expect(hrefs).toContain(expected);
    });
  });
});

// 7. Content sections
describe("CrapRules", () => {
  it("displays all 4 CRAP principles", () => {
    render(<CrapRules />);

    // Each principle name appears multiple times (card title, intro, do's list)
    expect(screen.getAllByText(/Contrast/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Herhaling/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Uitlijning/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Nabijheid/).length).toBeGreaterThanOrEqual(1);
  });
});

describe("BrandHistory", () => {
  it("displays working group members and timeline years", () => {
    render(<BrandHistory />);

    expect(screen.getByText("Abel Kappenburg")).toBeInTheDocument();
    expect(screen.getByText("2021")).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });
});

describe("Introduction", () => {
  it("displays the founding text", () => {
    render(<Introduction />);

    expect(
      screen.getByText(/Dodeka is opgericht in 2019/)
    ).toBeInTheDocument();
  });
});

describe("DesignTips", () => {
  it("displays design tips and shapes guide", () => {
    render(<DesignTips />);

    expect(screen.getByText(/Behoud hiërarchie/)).toBeInTheDocument();
    expect(screen.getByText(/Witruimte/)).toBeInTheDocument();
  });
});
