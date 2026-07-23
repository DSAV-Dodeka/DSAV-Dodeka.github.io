import "./Typography.scss";

const MONTSERRAT_URL = "https://fonts.google.com/specimen/Montserrat";
const SOURCE_SANS_URL = "https://fonts.google.com/specimen/Source+Sans+3";

function Typography() {
  return (
    <div className="typography">
      <p className="typography__description">
        We gebruiken het lettertype Montserrat voor een clean, modern, maar ook
        dynamisch uiterlijk. Het is een goed leesbaar lettertype voor titels en
        is makkelijk van ver te lezen. Voor een{" "}
        <strong>leestekst</strong> is Montserrat <strong>niet</strong> geschikt,
        daarom gebruik je Source Sans 3 voor alles waar je zinnen van moet lezen.
        Gebruik daarom Montserrat Bold ook als je in een afbeelding 1 woord wil
        duidelijk maken, gebruik daar niet een zwak lettertype.
      </p>

      <div className="typography__examples">
        <a
          href={MONTSERRAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="typography__example typography__example--title"
        >
          Titel: Montserrat Black
        </a>
        <a
          href={MONTSERRAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="typography__example typography__example--heading"
        >
          Kop 1: Montserrat Bold
        </a>
        <a
          href={SOURCE_SANS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="typography__example typography__example--body"
        >
          Lees tekst: Source Sans 3
        </a>
      </div>
    </div>
  );
}

export default Typography;
