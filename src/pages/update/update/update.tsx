import { useState } from "react";
import { getTimelineItems, parseDatum } from "$functions/changelog";
import type { TijdlijnItem, ChangelogEntry } from "$functions/changelog";
import PageTitle from "$components/PageTitle";
import CategorieFilter from "./components/CategorieFilter";
import TijdlijnGroep from "./components/TijdlijnGroep";
import UpdateKaart from "./components/UpdateKaart";
import CompacteKaart from "./components/CompacteKaart";
import ReleaseMomentEntry from "./components/ReleaseMomentEntry";
import "./Update.scss";

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

function getGroepLabel(datum: string): string {
  const date = parseDatum(datum);
  const maand = MAANDEN[date.getMonth()]!;
  return maand.charAt(0).toUpperCase() + maand.slice(1) + " " + date.getFullYear();
}

function getDatum(item: TijdlijnItem): string {
  return item.type === "update" ? item.entry.datum : item.moment.datum;
}

function filterItems(items: TijdlijnItem[], filter: string): TijdlijnItem[] {
  if (filter === "alles") return items;

  const result: TijdlijnItem[] = [];
  for (const item of items) {
    if (item.type === "update") {
      if (item.entry.categorie === filter) {
        result.push(item);
      }
    } else {
      const matchingUpdates = item.updates.filter((u) => u.categorie === filter);
      if (matchingUpdates.length > 0) {
        result.push({ type: "moment", moment: item.moment, updates: matchingUpdates });
      }
    }
  }
  return result;
}

function groepeerPerMaand(items: TijdlijnItem[]): { label: string; items: TijdlijnItem[] }[] {
  const groepen: { label: string; items: TijdlijnItem[] }[] = [];

  for (const item of items) {
    const label = getGroepLabel(getDatum(item));
    const laatste = groepen[groepen.length - 1];
    if (laatste && laatste.label === label) {
      laatste.items.push(item);
    } else {
      groepen.push({ label, items: [item] });
    }
  }

  return groepen;
}


function renderItems(items: TijdlijnItem[]) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < items.length) {
    const item = items[i]!;

    if (item.type === "update" && (item.entry.grootte ?? "groot") === "klein") {
      // Collect consecutive standalone klein items
      const kleinGroep: ChangelogEntry[] = [];
      while (i < items.length) {
        const huidig = items[i]!;
        if (huidig.type !== "update" || (huidig.entry.grootte ?? "groot") !== "klein") break;
        kleinGroep.push(huidig.entry);
        i++;
      }

      const eerste = kleinGroep[0]!;
      if (kleinGroep.length > 1) {
        elements.push(
          <div className="compacte-groep" key={`compact-${eerste.id}`}>
            {kleinGroep.map((entry) => (
              <CompacteKaart key={entry.id} entry={entry} />
            ))}
          </div>
        );
      } else {
        elements.push(<CompacteKaart key={eerste.id} entry={eerste} />);
      }
    } else if (item.type === "update") {
      elements.push(<UpdateKaart key={item.entry.id} entry={item.entry} />);
      i++;
    } else {
      elements.push(
        <ReleaseMomentEntry key={item.moment.id} moment={item.moment} updates={item.updates} />
      );
      i++;
    }
  }

  return elements;
}

function Update() {
  const timelineItems = getTimelineItems();
  const [filter, setFilter] = useState<string>("alles");
  const [aantalZichtbaar, setAantalZichtbaar] = useState(10);

  const gefilterd = filterItems(timelineItems, filter);
  const zichtbaar = gefilterd.slice(0, aantalZichtbaar);
  const groepen = groepeerPerMaand(zichtbaar);
  const heeftMeer = aantalZichtbaar < gefilterd.length;

  return (
    <div className="update-pagina">
      <PageTitle title="Website Updates" />
      <CategorieFilter actief={filter} onChange={(cat) => { setFilter(cat); setAantalZichtbaar(10); }} />

      {gefilterd.length === 0 ? (
        <p className="update-pagina__leeg">Geen updates gevonden</p>
      ) : (
        <>
          {groepen.map((groep) => (
            <TijdlijnGroep key={groep.label} label={groep.label}>
              {renderItems(groep.items)}
            </TijdlijnGroep>
          ))}

          {heeftMeer && (
            <button
              type="button"
              className="update-pagina__laad-meer"
              onClick={() => setAantalZichtbaar((n) => n + 10)}
            >
              Laad meer
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Update;