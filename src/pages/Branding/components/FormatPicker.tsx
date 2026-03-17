import "./FormatPicker.scss";

export const DOWNLOAD_FORMATS = ["svg", "png", "ai", "eps"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

export function buildDownloadPath(
  logoId: string,
  colorVariant: string,
  format: string
): string {
  return `/branding/${logoId}/${logoId}-${colorVariant}.${format}`;
}

interface FormatPickerProps {
  logoName: string;
  logoId: string;
  colorVariant: "dark" | "white";
}

function FormatPicker({ logoName, logoId, colorVariant }: FormatPickerProps) {
  return (
    <div className="format-picker">
      <h3 className="format-picker__heading">{logoName}</h3>
      <ul className="format-picker__list">
        {DOWNLOAD_FORMATS.map((format) => {
          const href = buildDownloadPath(logoId, colorVariant, format);
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
