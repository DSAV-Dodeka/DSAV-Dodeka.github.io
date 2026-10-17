import "./Wedstrijd.scss";
import { getHashedImageUrl } from "$functions/links";
import goud from "$images/wedstrijden/goud.webp";
import zilver from "$images/wedstrijden/zilver.webp";
import brons from "$images/wedstrijden/brons.webp";

interface Prijs {
  plaats: number;
  naam: string;
  afstand: string;
}

interface WedstrijdProps {
  naam: string;
  foto: string;
  prijzen: Prijs[];
  prestaties: string[];
}

function getMedaille(prijzen: Prijs[], plek: number): string {
  const medaille = prijzen.filter((prijs) => prijs.plaats === plek);

  // Stap 1: groepeer op naam
  const personen = new Map<string, Set<string>>();

  for (const prijs of medaille) {
    if (!personen.has(prijs.naam)) {
      personen.set(prijs.naam, new Set());
    }
    personen.get(prijs.naam)!.add(prijs.afstand);
  }

  // Stap 2: groepeer alle personen met één afstand per afstand
  const perAfstand = new Map<string, string[]>();
  const resultaat: string[] = [];

  for (const [naam, afstanden] of personen) {
    const lijst = [...afstanden];

    if (lijst.length > 1) {
      // Meerdere afstanden: direct toevoegen
      resultaat.push(`${naam} (${lijst.join(", ")})`);
    } else {
      // Eén afstand: later groeperen
      const afstand = lijst[0]!;
      if (!perAfstand.has(afstand)) {
        perAfstand.set(afstand, []);
      }
      perAfstand.get(afstand)!.push(naam);
    }
  }

  // Stap 3: voeg de gegroepeerde afstanden toe
  for (const [afstand, namen] of perAfstand) {
    resultaat.unshift(`${namen.join(", ")} (${afstand})`);
  }

  return resultaat.length ? resultaat.join(", ") : "-";
}

function Wedstrijd(props: WedstrijdProps) {
  return (
    <div className="wedstrijd_hoogtepunten">
      <div className="hoogtepunten_wedstrijd">{props.naam}</div>
      <img
        className="hoogtepunten_foto"
        src={getHashedImageUrl("/wedstrijden/" + props.foto)}
      />

      <div className="hoogtepunten_prijzen">
        <div className="hoogtepunten_titel_container">
          <p className="hoogtepunten_titel">Prijzen</p>
        </div>
        <div className="hoogtepunten_medaille_container">
          <img className="hoogtepunten_medaille" src={goud} alt="" />
          <img className="hoogtepunten_medaille" src={zilver} alt="" />
          <img className="hoogtepunten_medaille" src={brons} alt="" />
        </div>
        <div className="hoogtepunten_text_container">
          <p className="hoogtepunten_text">{getMedaille(props.prijzen, 1)}</p>
          <p className="hoogtepunten_text">{getMedaille(props.prijzen, 2)}</p>
          <p className="hoogtepunten_text">{getMedaille(props.prijzen, 3)}</p>
        </div>
      </div>
      <div className="hoogtepunten_divider"></div>
      <div className="hoogtepunten_prestaties">
        <div className="hoogtepunten_titel_container">
          <p className="hoogtepunten_titel">Bijzondere prestaties</p>
        </div>
        <div className="hoogtepunten_prestaties_container">
          <p className="hoogtepunten_text_prestatie">{props.prestaties[0]}</p>
          <p className="hoogtepunten_text_prestatie">{props.prestaties[1]}</p>
          <p className="hoogtepunten_text_prestatie">{props.prestaties[2]}</p>
        </div>
      </div>
    </div>
  );
}

export default Wedstrijd;
