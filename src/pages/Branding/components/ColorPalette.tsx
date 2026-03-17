import { useClipboard } from "../hooks/useClipboard";
import "./ColorPalette.scss";

export interface ColorInfo {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string;
}

export const PRIMARY_COLORS: ColorInfo[] = [
  { name: "Dodeka Blauw", hex: "#001D48", rgb: "rgb(0,29,72)", cmyk: "cmyk(100, 60, 0, 72)", pantone: "293 C" },
  { name: "Baan Rood", hex: "#BB4B3D", rgb: "rgb(187, 75, 61)", cmyk: "cmyk(0, 60, 67, 27)", pantone: "18-1142 TPX" },
  { name: "Wit", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)", cmyk: "cmyk(0, 0, 0, 0)", pantone: "White" },
];

export const SECONDARY_COLORS: ColorInfo[] = [
  { name: "TU Blauw", hex: "#00A6D6", rgb: "rgb(0,166,214)", cmyk: "cmyk(75, 14, 7, 0)", pantone: "Process Cyan C" },
  { name: "Team NL Oranje", hex: "#FF914D", rgb: "rgb(255, 145, 77)", cmyk: "cmyk(0, 43, 70, 0)", pantone: "1575 C" },
];

type ColorValueKey = "hex" | "rgb" | "cmyk" | "pantone";

const COLOR_VALUE_LABELS: { key: ColorValueKey; label: string }[] = [
  { key: "hex", label: "HEX" },
  { key: "rgb", label: "RGB" },
  { key: "cmyk", label: "CMYK" },
  { key: "pantone", label: "Pantone" },
];

function handleKeyDown(callback: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
}

function ColorPalette() {
  const { copy, copied } = useClipboard();

  const renderSwatch = (color: ColorInfo) => {
    const isLight = color.hex.toUpperCase() === "#FFFFFF";

    return (
      <div key={color.name} className="color-swatch">
        <div
          className={`color-swatch__preview ${isLight ? "color-swatch__preview--light" : ""}`}
          style={{ backgroundColor: color.hex }}
          role="button"
          tabIndex={0}
          onClick={() => copy(color.hex)}
          onKeyDown={handleKeyDown(() => copy(color.hex))}
          aria-label={`Kopieer ${color.name} kleurcode ${color.hex}`}
        />
        <div className="color-swatch__info">
          <span className="color-swatch__name">{color.name}</span>
          {COLOR_VALUE_LABELS.map(({ key, label }) => (
            <span
              key={key}
              className="color-swatch__value"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                copy(color[key]);
              }}
              onKeyDown={handleKeyDown(() => copy(color[key]))}
              aria-label={`Kopieer ${label} waarde ${color[key]}`}
            >
              <strong>{label}:</strong> {color[key]}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="color-palette">
      <div className="color-palette__section">
        <h3 className="color-palette__heading">Primaire Kleuren</h3>
        <div className="color-palette__grid color-palette__grid--primary">
          {PRIMARY_COLORS.map(renderSwatch)}
        </div>
      </div>
      <div className="color-palette__section">
        <h3 className="color-palette__heading">Secundaire Kleuren</h3>
        <div className="color-palette__grid color-palette__grid--secondary">
          {SECONDARY_COLORS.map(renderSwatch)}
        </div>
      </div>
      {copied && (
        <div className="color-palette__toast" role="status" aria-live="polite">
          Gekopieerd!
        </div>
      )}
    </div>
  );
}

export default ColorPalette;
