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
    id: "het-logo",
    name: "Hét Logo",
    description:
      "Dit is ons meest herkenbare logo en heeft de sterkste link met Dodeka. Gebruik dit logo wanneer je kan.",
    previewDark: "/branding/het-logo/dodeka_het-logo-blauw.svg",
    previewWhite: "/branding/het-logo/dodeka_het-logo_wit.svg",
  },
  {
    id: "volledige-logo",
    name: "Volledige Logo",
    description:
      "Het volledige logo met de naam uitgeschreven. Gebruik dit in formele settings zoals officiële documenten en briefpapier.",
    previewDark: "/branding/volledige-logo/dodeka_volledige_logo_blauw.svg",
    previewWhite: "/branding/volledige-logo/dodeka_volledige_logo_wit.svg",
  },
  {
    id: "icoon",
    name: "Icoon",
    description:
      "Het icoon gebruik je wanneer de tekst van de andere logo's onleesbaar zal zijn.",
    previewDark: "/branding/icoon/dodeka_icoon_blauw.svg",
    previewWhite: "/branding/icoon/dodeka_icoon_wit.svg",
  },
  {
    id: "woord",
    name: "Woord",
    description:
      "Alleen de tekst 'Dodeka', zonder het icoon. Gebruik dit wanneer het icoon al elders zichtbaar is.",
    previewDark: "/branding/woord/dodeka_woord-blauw.svg",
    previewWhite: "/branding/woord/dodeka_woord-wit.svg",
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
      <div className="logo-section__intro">
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
      </div>

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
