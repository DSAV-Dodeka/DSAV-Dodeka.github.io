import "./FormatPicker.scss";

export const DOWNLOAD_FORMATS = ["svg", "png"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

export function buildDownloadPath(
  previewSrc: string,
  format: string
): string {
  // Preview src is always .svg — replace extension for the desired format
  return previewSrc.replace(/\.svg$/, `.${format}`);
}

interface FormatPickerProps {
  logoName: string;
  logoId: string;
  colorVariant: "dark" | "white";
  previewSrc: string;
}

function FormatPicker({ logoName, logoId, colorVariant, previewSrc }: FormatPickerProps) {
  const isDark = colorVariant === "dark";

  return (
    <div className="format-picker">
      <div className={`format-picker__preview ${isDark ? "format-picker__preview--light" : "format-picker__preview--dark"}`}>
        <img src={previewSrc} alt={logoName} />
      </div>
      <p className="format-picker__subtitle">Download als:</p>
      <ul className="format-picker__list">
        {DOWNLOAD_FORMATS.map((format) => {
          const href = buildDownloadPath(previewSrc, format);
          const available = true; // all formats shown as available for now

          return (
            <li key={format} className="format-picker__item">
              <a
                className={`format-picker__button${!available ? " format-picker__button--disabled" : ""}`}
                href={available ? href : undefined}
                download={available ? true : undefined}
                aria-disabled={!available ? "true" : undefined}
                onClick={
                  !available ? (e: React.MouseEvent) => e.preventDefault() : undefined
                }
              >
                {format.toUpperCase()}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FormatPicker;
