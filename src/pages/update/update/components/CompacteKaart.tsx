import type { ChangelogEntry } from "$functions/changelog";
import { getCategorieEmoji, parseDatum } from "$functions/changelog";

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

function formatDatum(datum: string): string {
  const date = parseDatum(datum);
  return `${date.getDate()} ${MAANDEN[date.getMonth()]} ${date.getFullYear()}`;
}

interface CompacteKaartProps {
  entry: ChangelogEntry;
}

function CompacteKaart({ entry }: CompacteKaartProps) {
  const emoji = getCategorieEmoji(entry.categorie);

  return (
    <article className="compacte-kaart">
      <span className="compacte-kaart__categorie">{emoji}</span>
      <span className="compacte-kaart__titel">{entry.titel}</span>
      {entry.auteur && (
        <span className="compacte-kaart__auteur">{entry.auteur}</span>
      )}
      <span className="compacte-kaart__datum">{formatDatum(entry.datum)}</span>
      <span className="compacte-kaart__tooltip">{entry.beschrijving}</span>
    </article>
  );
}

export default CompacteKaart;
