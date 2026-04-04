import type { ChangelogEntry, ReleaseMoment } from "$functions/changelog";
import UpdateKaart from "./UpdateKaart";
import CompacteKaart from "./CompacteKaart";

interface ReleaseMomentEntryProps {
  moment: ReleaseMoment;
  updates: ChangelogEntry[];
}

function ReleaseMomentEntry({ moment, updates }: ReleaseMomentEntryProps) {
  return (
    <section className="release-moment">
      <div className="release-moment__header">
        <h3 className="release-moment__naam">{moment.naam}</h3>
        <p className="release-moment__beschrijving">{moment.beschrijving}</p>
      </div>
      <div className="release-moment__updates">
        {updates.map((entry) =>
          entry.grootte === "klein" ? (
            <CompacteKaart key={entry.id} entry={entry} />
          ) : (
            <UpdateKaart key={entry.id} entry={entry} />
          )
        )}
      </div>
    </section>
  );
}

export default ReleaseMomentEntry;
