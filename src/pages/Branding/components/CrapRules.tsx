import "./CrapRules.scss";

/* ── Principes met uitgebreide uitleg ── */

const PRINCIPLES = [
  {
    name: "Contrast",
    summary:
      "Contrast trekt de aandacht en stuurt de lezer door het ontwerp. Het gaat niet alleen om kleur — ook grootte, gewicht, vorm en witruimte creëren contrast.",
    tips: [
      "Gebruik Dodeka Blauw (#001D48) als primaire achtergrond met witte tekst voor maximale leesbaarheid.",
      "Maak koppen duidelijk groter en zwaarder dan broodtekst (bijv. Montserrat Black 36px vs. Source Sans 3 Regular 16px).",
      "Vermijd subtiele kleurverschillen — als twee elementen niet hetzelfde zijn, maak ze dan duidelijk anders.",
      "Gebruik witruimte als contrast: een enkel element met veel ruimte eromheen springt eruit.",
    ],
  },
  {
    name: "Herhaling",
    summary:
      "Herhaling zorgt voor herkenbaarheid en samenhang. Door visuele elementen consequent te hergebruiken, bouw je een sterk en herkenbaar merk op.",
    tips: [
      "Gebruik altijd dezelfde kleurencombinaties: Dodeka Blauw, Baan Rood en Wit als basis.",
      "Houd lettertypes consistent: Montserrat voor koppen, Source Sans 3 voor broodtekst.",
      "Herhaal dezelfde stijl voor knoppen, kaarten en secties door het hele ontwerp heen.",
      "Gebruik het logo altijd in een goedgekeurde variant — wissel niet willekeurig tussen versies.",
    ],
  },
  {
    name: "Uitlijning",
    summary:
      "Uitlijning geeft structuur en orde. Elk element op de pagina moet een visuele verbinding hebben met een ander element — niets mag er willekeurig geplaatst uitzien.",
    tips: [
      "Werk met een consistent grid of kolommensysteem voor alle layouts.",
      "Lijn tekst, afbeeldingen en knoppen uit op dezelfde onzichtbare lijnen.",
      "Vermijd gecentreerde tekst in lange alinea's — links uitlijnen is beter leesbaar.",
      "Zorg dat marges en padding consistent zijn door het hele ontwerp.",
    ],
  },
  {
    name: "Nabijheid",
    summary:
      "Nabijheid communiceert relaties. Elementen die bij elkaar horen, moeten dicht bij elkaar staan. Elementen die niet gerelateerd zijn, moeten visueel gescheiden worden.",
    tips: [
      "Plaats een kop altijd dichter bij de bijbehorende tekst dan bij de vorige sectie.",
      "Groepeer gerelateerde informatie (bijv. icoon + label + beschrijving) in duidelijke blokken.",
      "Gebruik meer witruimte tussen secties dan binnen secties om hiërarchie te tonen.",
      "Vermijd 'zwevende' elementen die niet duidelijk bij een groep horen.",
    ],
  },
];

/* ── Vuistregels ── */

const VUISTREGELS = [
  {
    regel: "Squint-test",
    uitleg:
      "Knijp je ogen dicht en kijk naar je ontwerp. Kun je nog steeds de structuur en hiërarchie herkennen? Zo ja, dan werkt je contrast en uitlijning goed.",
  },
  {
    regel: "3-seconden regel",
    uitleg:
      "Een kijker moet binnen 3 seconden begrijpen wat het belangrijkste element op de pagina is. Als dat niet lukt, ontbreekt er contrast.",
  },
  {
    regel: "Maximaal 2 lettertypes",
    uitleg:
      "Gebruik niet meer dan twee lettertypefamilies (Montserrat + Source Sans 3). Meer lettertypes zorgen voor visuele ruis.",
  },
  {
    regel: "Gulden snede (1 : 1,618)",
    uitleg:
      "Gebruik de verhouding 1 : 1,618 voor het verdelen van ruimte, bijvoorbeeld bij kolommen of de verhouding tussen een afbeelding en tekst. Deze verhouding voelt van nature harmonieus en gebalanceerd.",
  },
  {
    regel: "Eén boodschap per ontwerp",
    uitleg:
      "Elk ontwerp moet één duidelijke boodschap of actie communiceren. Als je meer dan één ding probeert te zeggen, concurreren de elementen met elkaar en verliest de kijker focus.",
  },
  {
    regel: "Witruimte is geen lege ruimte",
    uitleg:
      "Witruimte is een actief ontwerpelement. Het geeft elementen ademruimte en maakt het ontwerp professioneler en leesbaarder.",
  },
];

/* ── Veelgemaakte fouten ── */

const FOUTEN = [
  "Tekst in Baan Rood op een Dodeka Blauw achtergrond — onvoldoende contrast.",
  "Te veel verschillende lettertypes of -groottes op één pagina.",
  "Elementen die 'zweven' zonder duidelijke uitlijning of groepering.",
  "Inconsistent gebruik van kleuren of logo-varianten tussen materialen.",
  "Te weinig witruimte waardoor het ontwerp druk en onoverzichtelijk wordt.",
  "Koppen die even groot zijn als broodtekst — geen duidelijke hiërarchie.",
];

/* ── Visuele voorbeelden per principe ── */

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

/* ── Component ── */

function CrapRules() {
  return (
    <div className="crap-rules">
      <p className="crap-rules__intro">
        De <strong>CRAP</strong>-principes — <strong>Contrast</strong>,{" "}
        <strong>Repetition</strong> (Herhaling), <strong>Alignment</strong>{" "}
        (Uitlijning) en <strong>Proximity</strong> (Nabijheid) — vormen de
        basis van elk goed ontwerp. Ze zijn bedacht door ontwerper Robin
        Williams en helpen om visuele communicatie helder, professioneel en
        consistent te maken. Hieronder leggen we elk principe uit met
        praktische tips voor Dodeka-materiaal.
      </p>

      {/* ── Principe-kaarten met visueel + uitleg ── */}
      <div className="crap-rules__principles">
        {PRINCIPLES.map((p) => {
          const Visual = PRINCIPLE_VISUALS[p.name];
          return (
            <div key={p.name} className="crap-rules__principle">
              <div className="crap-rules__principle-visual">
                <Visual />
              </div>
              <div className="crap-rules__principle-content">
                <h4 className="crap-rules__principle-title">{p.name}</h4>
                <p className="crap-rules__principle-summary">{p.summary}</p>
                <ul className="crap-rules__principle-tips">
                  {p.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Vuistregels voor designers ── */}
      <h3 className="crap-rules__section-heading">Vuistregels voor designers</h3>
      <div className="crap-rules__vuistregels">
        {VUISTREGELS.map((v) => (
          <div key={v.regel} className="crap-rules__vuistregel">
            <span className="crap-rules__vuistregel-label">{v.regel}</span>
            <p className="crap-rules__vuistregel-text">{v.uitleg}</p>
          </div>
        ))}
      </div>

      {/* ── Veelgemaakte fouten ── */}
      <h3 className="crap-rules__section-heading">Veelgemaakte fouten</h3>
      <div className="crap-rules__fouten">
        <ul className="crap-rules__fouten-list">
          {FOUTEN.map((fout) => (
            <li key={fout}>{fout}</li>
          ))}
        </ul>
      </div>

      {/* ── Kleurcontrast voorbeeld (behouden) ── */}
      <h3 className="crap-rules__section-heading">Kleurcontrast voorbeeld</h3>
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
