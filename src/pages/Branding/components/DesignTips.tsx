import "./DesignTips.scss";

const TIPS = [
  {
    label: "Behoud hiërarchie",
    text: "Gebruik de verschillende lettertypegewichten en -groottes om een duidelijke visuele hiërarchie te creëren. Gebruik Heading 1 voor titels op het hoogste niveau en leestekst voor hoofdalinea's.",
  },
  {
    label: "Witruimte is je vriend",
    text: "Geef elementen ruimte om te ademen. Maak je ontwerpen niet te vol en gebruik voldoende padding en marges.",
  },
  {
    label: "Test op toegankelijkheid",
    text: "Zorg er altijd voor dat je kleurcombinaties voldoende contrast hebben voor mensen met een visuele beperking. Gebruik online tools om de toegankelijkheid te controleren.",
  },
  {
    label: "Bestandsformaten",
    text: "Gebruik SVG of hoge-resolutie PNG voor logo's op het web. Gebruik voor print vectorformaten zoals AI of EPS om kwaliteit te garanderen.",
  },
];

function DesignTips() {
  return (
    <div className="design-tips">
      <div className="design-tips__list-card">
        <ul className="design-tips__list">
          {TIPS.map((tip) => (
            <li key={tip.label}>
              <strong>{tip.label}:</strong> {tip.text}
            </li>
          ))}
        </ul>
      </div>

      <h3 className="design-tips__subtitle">Vormen gids</h3>

      <div className="design-tips__shapes">
        <div className="design-tips__shapes-column">
          <h4 className="design-tips__shapes-heading design-tips__shapes-heading--do">
            ✅ Aanbevolen vormen
          </h4>
          <p className="design-tips__shapes-text">
            Gebruik geometrische vormen zoals cirkels, vierkanten of eenvoudige
            lijnen die passen bij de strakke en moderne uitstraling van het merk.
            Deze vormen kunnen worden verwerkt in ontwerpelementen, iconen en
            lay-outs.
          </p>
        </div>
        <div className="design-tips__shapes-column">
          <h4 className="design-tips__shapes-heading design-tips__shapes-heading--dont">
            ❌ Vormen om te vermijden
          </h4>
          <p className="design-tips__shapes-text">
            Vermijd te complexe, hoekige of onprofessionele vormen die kunnen
            botsen met de identiteit van het merk. Dit geldt ook voor vormen met
            een te "retro" of "futuristisch" gevoel, tenzij ze specifiek
            onderdeel zijn van een campagne.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DesignTips;
