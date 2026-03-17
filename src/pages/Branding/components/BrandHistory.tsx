import "./BrandHistory.scss";

const WORKING_GROUP_MEMBERS = [
  "Abel Kappenburg",
  "Donne Gerlich",
  "Lianne Folkerts",
  "Koen Stapel",
  "Nathan Douenburg",
  "Jefry el Bhwash",
];

const TIMELINE_EVENTS = [
  {
    year: "2021",
    description:
      "Op 31 maart 2021 hebben zij dit logo gepresenteerd aan de vereniging via een discord meeting.",
  },
  {
    year: "2022",
    description:
      "In November 2022 is door Jefry het huisstijl document opgesteld. Hierna heeft Donne meegeholpen.",
  },
  {
    year: "2025",
    description:
      "Door Itse is het afmaken van de huisstijl weer in het leven geroepen, met een nieuwe werkgroep bestaande uit Itse Veltmeijer, Julius Knoester, Noortje Molenaar, Xylander Parqui, Anne-Wil van Werkhoven en Jefry.",
  },
];

function BrandHistory() {
  return (
    <div className="brand-history">
      <div className="brand-history__narrative">
        <p className="brand-history__text">
          Na de naamsverandering begin 2021 is er een logo-werkgroep opgericht,
          bestaande uit:
        </p>
        <ul className="brand-history__members">
          {WORKING_GROUP_MEMBERS.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
        <p className="brand-history__text">
          Deze mensen hebben zich bezig gehouden met het logo, de kleur en het
          lettertype. Er zijn een reeks aan mogelijke logo's voorbij gekomen,
          maar één daarvan viel op. Dat logo was namelijk iets verder dan de
          conceptfase omdat een vriend van Jefry, Raúl Cortés Peña, op het
          concept van Jefry zijn design-skills had uitgeoefend. Dit logo werd
          snel de favoriet en vanaf dat punt is de groep bezig geweest met de
          verschillende versies van het logo die je nu kent.
        </p>
        <p className="brand-history__text">
          Op 31 maart 2021 hebben zij dit logo gepresenteerd aan de vereniging
          via een discord meeting. Echter is uit dit proces nooit een formeel
          document voortgekomen. Daarom is er in November 2022 door Jefry dit
          huisstijl document opgesteld. Hierna heeft Donne meegeholpen.
        </p>
        <p className="brand-history__text">
          Later in 2025 is door Itse het afmaken van de huisstijl weer in het
          leven geroepen. Daar is in overleg met Jefry een werkgroep uit
          voortgekomen met Itse Veltmeijer, Julius Knoester, Noortje Molenaar,
          Xylander Parqui, Anne-Wil van Werkhoven en Jefry. Zij hebben de
          huisstijl opnieuw opgepakt en zo zijn daar de Canva met allerlei
          templates en dit document/deze webpagina uit voortgekomen.
        </p>
      </div>

      <h3 className="brand-history__subtitle">Tijdlijn</h3>
      <div className="brand-history__timeline">
        {TIMELINE_EVENTS.map((event) => (
          <div key={event.year} className="brand-history__event">
            <span className="brand-history__year">{event.year}</span>
            <p className="brand-history__event-text">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrandHistory;
