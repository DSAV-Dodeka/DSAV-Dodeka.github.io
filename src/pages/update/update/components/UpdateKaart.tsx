import type { ChangelogEntry } from "$functions/changelog";
import { getCategorieEmoji, isNieuw, parseDatum } from "$functions/changelog";

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

function formatDatum(datum: string): string {
  const date = parseDatum(datum);
  return `${date.getDate()} ${MAANDEN[date.getMonth()]} ${date.getFullYear()}`;
}

interface UpdateKaartProps {
  entry: ChangelogEntry;
}

function UpdateKaart({ entry }: UpdateKaartProps) {
  const emoji = getCategorieEmoji(entry.categorie);
  const nieuw = entry.forceNieuw || (entry.categorie === "feature" && isNieuw(entry.datum));
  const isFeatured = entry.id === "feature-inloggen-productie";

  return (
    <article className={`update-kaart update-kaart--${entry.categorie}${isFeatured ? " update-kaart--featured" : ""}${entry.grootte === "groot" ? " update-kaart--groot" : ""}`}>
      <div className="update-kaart__header">
        <span className="update-kaart__categorie">{emoji}</span>
        <h3 className="update-kaart__titel">{entry.titel}</h3>
        {nieuw && <span className="update-kaart__badge">Nieuw</span>}
        {entry.versie && (
          <span className="update-kaart__versie">{entry.versie}</span>
        )}
      </div>
      <p className="update-kaart__datum">{formatDatum(entry.datum)}</p>
      <p className="update-kaart__beschrijving">{entry.beschrijving}</p>
      {entry.auteur && (
        <p className="update-kaart__auteur">Door {entry.auteur}</p>
      )}
      {entry.afbeelding && (
        <img
          className="update-kaart__afbeelding"
          src={entry.afbeelding}
          alt={entry.titel}
        />
      )}
      {entry.link && (
        <a className="update-kaart__link" href={entry.link}>
          Bekijk →
        </a>
      )}
    </article>
  );
}

export default UpdateKaart;
