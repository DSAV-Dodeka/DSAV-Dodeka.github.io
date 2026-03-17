import "./CrapRules.scss";

const DOS_LIST = [
  {
    label: "Contrast",
    text: "Zorg voor voldoende contrast tussen tekst- en achtergrondkleuren voor leesbaarheid, en gebruik grootte/gewicht om belangrijke elementen te onderscheiden.",
  },
  {
    label: "Herhaling",
    text: "Gebruik dezelfde kleuren, lettertypes en logoversies consistent in al het brandingmateriaal.",
  },
  {
    label: "Uitlijning",
    text: "Lijn elementen uit om een duidelijke, georganiseerde structuur te creëren. Gebruik geen willekeurige of inconsistente tussenruimte.",
  },
  {
    label: "Nabijheid",
    text: "Groepeer gerelateerde elementen samen om te laten zien dat ze bij elkaar horen. Een kop moet bijvoorbeeld dichter bij zijn alinea staan dan bij de volgende kop.",
  },
];

const DONTS_LIST = [
  "Vermijd kleurcombinaties met weinig contrast of visuele elementen die met elkaar concurreren om aandacht.",
  "Introduceer geen nieuwe, niet-goedgekeurde kleuren of lettertypes zonder duidelijke reden.",
  "Rek, verpletter of vervorm het logo nooit, en behoud altijd de vrije ruimte eromheen.",
  "Vermijd het willekeurig plaatsen van elementen of inconsistente tussenruimte die het ontwerp rommelig maakt.",
];

function ContrastVisual() {
  return (
    <div className="crap-visual">
      <div className="crap-visual__box crap-visual__box--dark">
        <span className="crap-visual__label crap-visual__label--light">Contrast</span>
      </div>
      <div className="crap-visual__box crap-visual__box--light">
        <span className="crap-visual__label crap-visual__label--muted">Minder contrast</span>
      </div>
    </div>
  );
}

function RepetitionVisual() {
  return (
    <div className="crap-visual">
      <div className="crap-visual__row">
        <div className="crap-visual__circle" />
        <div className="crap-visual__circle" />
        <div className="crap-visual__circle" />
      </div>
      <div className="crap-visual__row">
        <div className="crap-visual__circle" />
        <div className="crap-visual__circle" />
        <div className="crap-visual__circle" />
      </div>
    </div>
  );
}

function AlignmentVisual() {
  return (
    <div className="crap-visual">
      <div className="crap-visual__align-block">
        <div className="crap-visual__bar crap-visual__bar--75" />
        <div className="crap-visual__bar crap-visual__bar--100" />
        <div className="crap-visual__bar crap-visual__bar--50" />
      </div>
      <div className="crap-visual__align-block">
        <div className="crap-visual__bar crap-visual__bar--75 crap-visual__bar--right" />
        <div className="crap-visual__bar crap-visual__bar--100" />
        <div className="crap-visual__bar crap-visual__bar--50 crap-visual__bar--right" />
      </div>
    </div>
  );
}

function ProximityVisual() {
  return (
    <div className="crap-visual">
      <div className="crap-visual__proximity-block">
        <div className="crap-visual__proximity-group">
          <div className="crap-visual__circle crap-visual__circle--small" />
          <div className="crap-visual__circle crap-visual__circle--small" />
        </div>
        <div className="crap-visual__rect" />
      </div>
      <div className="crap-visual__proximity-block">
        <div className="crap-visual__proximity-group">
          <div className="crap-visual__circle crap-visual__circle--small" />
          <div className="crap-visual__circle crap-visual__circle--small" />
        </div>
        <div className="crap-visual__rect" />
      </div>
    </div>
  );
}

const PRINCIPLE_VISUALS: Record<string, () => JSX.Element> = {
  Contrast: ContrastVisual,
  Herhaling: RepetitionVisual,
  Uitlijning: AlignmentVisual,
  Nabijheid: ProximityVisual,
};

function CrapRules() {
  return (
    <div className="crap-rules">
      <p className="crap-rules__intro">
        De <strong>CRAP</strong>-principes zijn fundamenteel voor goed ontwerp.
        Door <strong>Contrast</strong>, <strong>Herhaling</strong> (Repetition),{" "}
        <strong>Uitlijning</strong> (Alignment) en <strong>Nabijheid</strong> (Proximity) consistent
        toe te passen, creëer je een professionele, samenhangende en goed
        leesbare ervaring voor je publiek.
      </p>

      <div className="crap-rules__grid">
        {Object.entries(PRINCIPLE_VISUALS).map(([name, Visual]) => (
          <div key={name} className="crap-rules__card">
            <Visual />
            <p className="crap-rules__card-title">{name}</p>
          </div>
        ))}
      </div>

      <div className="crap-rules__lists">
        <div className="crap-rules__list">
          <h4 className="crap-rules__list-heading crap-rules__list-heading--do">
            ✅ Wel doen
          </h4>
          <ul className="crap-rules__items">
            {DOS_LIST.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="crap-rules__list">
          <h4 className="crap-rules__list-heading crap-rules__list-heading--dont">
            ❌ Niet doen
          </h4>
          <ul className="crap-rules__items">
            {DONTS_LIST.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="crap-rules__example-heading">Kleurcontrast voorbeeld</h3>
      <div className="crap-rules__contrast-example">
        <div className="crap-rules__contrast-card crap-rules__contrast-card--bad">
          <span className="crap-rules__contrast-badge crap-rules__contrast-badge--bad">✗</span>
          <div className="crap-rules__contrast-preview crap-rules__contrast-preview--bad">
            <span>Dodeka Blauw + Baan Rood</span>
          </div>
          <p className="crap-rules__contrast-caption">
            Baan Rood (#BB4B3D) op Dodeka Blauw (#001D48) heeft onvoldoende
            contrast en is slecht leesbaar.
          </p>
        </div>
        <div className="crap-rules__contrast-card crap-rules__contrast-card--good">
          <span className="crap-rules__contrast-badge crap-rules__contrast-badge--good">✓</span>
          <div className="crap-rules__contrast-preview crap-rules__contrast-preview--good">
            <span>Dodeka Blauw + Wit</span>
          </div>
          <p className="crap-rules__contrast-caption">
            Wit (#FFFFFF) op Dodeka Blauw (#001D48) heeft uitstekend contrast
            en is goed leesbaar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CrapRules;
