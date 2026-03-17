import "./LogoSection.scss";

export interface LogoVariant {
  id: string;
  name: string;
  description: string;
  previewDark: string;
  previewWhite: string;
}

export const LOGO_VARIANTS: LogoVariant[] = [
  {
    id: "elongated",
    name: "Elongated Logo",
    description:
      "Dit hoofdlogo wordt gebruikt wanneer dat kan. Als er genoeg ruimte is gebruik je altijd dit logo.",
    previewDark: "/branding/elongated/elongated-dark.svg",
    previewWhite: "/branding/elongated/elongated-white.svg",
  },
  {
    id: "upright",
    name: "Upright Full Logo",
    description:
      "Dit logo gebruik je wanneer er niet genoeg ruimte is voor het lange logo.",
    previewDark: "/branding/upright/upright-dark.svg",
    previewWhite: "/branding/upright/upright-white.svg",
  },
  {
    id: "monogram",
    name: "Monogram",
    description:
      "Het icoon gebruik je wanneer de tekst van de hoofdlogo's onleesbaar zal zijn.",
    previewDark: "/branding/monogram/monogram-dark.svg",
    previewWhite: "/branding/monogram/monogram-white.svg",
  },
];

interface LogoSectionProps {
  onLogoClick: (logo: LogoVariant, colorVariant: "dark" | "white") => void;
}

function handleKeyDown(callback: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
}

function LogoSection({ onLogoClick }: LogoSectionProps) {
  return (
    <div className="logo-section">
      <p className="logo-section__description">
        Het logo van D.S.A.V. Dodeka symboliseert een atletiek baan. Het
        lettertype is modern wat past bij de leeftijd van de vereniging. De d's
        en a's zijn aangepast naar de vorm van de atletiekbaan. En de dikte van
        de letters van "odeka" is aangepast naar de dikte van de lijnen van de
        atletiekbaan d.
      </p>
      <p className="logo-section__description">
        Ons logo maakt ons makkelijk herkenbaar voor andere mensen en
        verenigingen. Het is vanaf de andere kant van de atletiekbaan nog steeds
        goed te herkennen. Het is samen met veelvoudig braveren ons sterkste
        herkennigspunt. Daarom is het belangrijk dat we ons logo correct
        gebruiken.
      </p>

      <div className="logo-section__grid">
        {LOGO_VARIANTS.map((logo) => (
          <div key={logo.id} className="logo-card">
            <div
              className="logo-card__preview logo-card__preview--light"
              role="button"
              tabIndex={0}
              onClick={() => onLogoClick(logo, "dark")}
              onKeyDown={handleKeyDown(() => onLogoClick(logo, "dark"))}
              aria-label={`Download ${logo.name} (Donkerblauw)`}
            >
              <img src={logo.previewDark} alt={`${logo.name} Donkerblauw`} />
            </div>
            <p className="logo-card__label">{logo.name} (Donkerblauw)</p>

            <div
              className="logo-card__preview logo-card__preview--dark"
              role="button"
              tabIndex={0}
              onClick={() => onLogoClick(logo, "white")}
              onKeyDown={handleKeyDown(() => onLogoClick(logo, "white"))}
              aria-label={`Download ${logo.name} (Wit)`}
            >
              <img src={logo.previewWhite} alt={`${logo.name} Wit`} />
            </div>
            <p className="logo-card__label">{logo.name} (Wit)</p>

            <p className="logo-card__description">{logo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoSection;
