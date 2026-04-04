import "./DesignTips.scss";

const FILE_FORMATS = [
  {
    name: "SVG",
    type: "Vector",
    description:
      "Schaalbaar vectorformaat. Blijft scherp op elke grootte. Ideaal voor logo's, iconen en illustraties op het web. Kan met CSS gestyled worden.",
    use: "Web, digitale media, logo's",
  },
  {
    name: "EPS",
    type: "Vector",
    description:
      "Professioneel vectorformaat voor drukwerk. Wordt gebruikt door drukkerijen en is bewerkbaar in Adobe Illustrator. Bevat geen pixelinformatie.",
    use: "Drukwerk, professionele print",
  },
  {
    name: "PNG",
    type: "Raster",
    description:
      "Rasterformaat met ondersteuning voor transparantie. Verliesvrije compressie, dus geen kwaliteitsverlies. Bestanden zijn groter dan JPG.",
    use: "Web, presentaties, logo's op achtergronden",
  },
  {
    name: "JPG",
    type: "Raster",
    description:
      "Gecomprimeerd rasterformaat zonder transparantie. Kleine bestandsgrootte, maar verliest kwaliteit bij herhaald opslaan. Niet geschikt voor logo's.",
    use: "Foto's, social media, achtergrondafbeeldingen",
  },
  {
    name: "PDF",
    type: "Beide",
    description:
      "Kan zowel vector- als rasterdata bevatten. Universeel leesbaar en geschikt voor zowel digitaal als print. Behoud van layout gegarandeerd.",
    use: "Documenten, drukwerk, presentaties",
  },
  {
    name: "AI",
    type: "Vector",
    description:
      "Het native bestandsformaat van Adobe Illustrator. Bevat volledige bewerkbare vectordata inclusief lagen, effecten en lettertypes. Het meest flexibele formaat voor verdere bewerking.",
    use: "Bronbestanden, ontwerpaanpassingen, samenwerking met designers",
  },
];

function DesignTips() {
  return (
    <div className="design-tips">
      {/* CMYK uitleg */}
      <div className="design-tips__cmyk">
        <h3 className="design-tips__subtitle">Kleuren voor print: CMYK</h3>
        <div className="design-tips__cmyk-content">
          <p className="design-tips__text">
            De kleuren op deze pagina staan in HEX en RGB — dat zijn
            kleurruimtes voor schermen. Voor drukwerk wordt CMYK gebruikt
            (Cyan, Magenta, Yellow, Key/zwart). Het omzetten van HEX naar CMYK
            is niet simpelweg een wiskundige conversie: kleuren die er op een
            scherm helder uitzien, kunnen er gedrukt dof of anders uitzien.
          </p>
          <p className="design-tips__text">
            Dit komt doordat schermen licht uitzenden (additief) terwijl inkt
            licht absorbeert (subtractief). Felle kleuren zoals het TU Blauw
            of Team NL Oranje zijn op een scherm makkelijk te tonen, maar
            vallen buiten het bereik (gamut) van CMYK-inkt.
          </p>
          <div className="design-tips__cmyk-tips">
            <div className="design-tips__cmyk-tip">
              <span className="design-tips__cmyk-tip-icon">→</span>
              <p>
                Gebruik altijd de opgegeven Pantone-codes als referentie voor
                drukwerk. Pantone-kleuren zijn gestandaardiseerd en geven het
                meest betrouwbare resultaat.
              </p>
            </div>
            <div className="design-tips__cmyk-tip">
              <span className="design-tips__cmyk-tip-icon">→</span>
              <p>
                Vraag altijd een drukproef aan voordat je een grote oplage laat
                drukken. Beoordeel de kleuren bij daglicht, niet onder TL-verlichting.
              </p>
            </div>
            <div className="design-tips__cmyk-tip">
              <span className="design-tips__cmyk-tip-icon">→</span>
              <p>
                Vertrouw niet op de CMYK-preview op je scherm. Elk scherm toont
                kleuren anders, en CMYK-simulatie in software is een benadering.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bestandsformaten */}
      <h3 className="design-tips__subtitle">Bestandsformaten</h3>
      <p className="design-tips__text design-tips__text--intro">
        Kies het juiste formaat voor het juiste doel. Vectorformaten (SVG, EPS)
        zijn oneindig schaalbaar en ideaal voor logo's. Rasterformaten (PNG, JPG)
        bestaan uit pixels en verliezen kwaliteit bij vergroting.
      </p>

      <div className="design-tips__formats">
        {FILE_FORMATS.map((format) => (
          <div key={format.name} className="design-tips__format-card">
            <div className="design-tips__format-header">
              <span className="design-tips__format-name">{format.name}</span>
              <span className={`design-tips__format-badge design-tips__format-badge--${format.type.toLowerCase()}`}>
                {format.type}
              </span>
            </div>
            <p className="design-tips__format-desc">{format.description}</p>
            <p className="design-tips__format-use">
              <strong>Gebruik:</strong> {format.use}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignTips;
