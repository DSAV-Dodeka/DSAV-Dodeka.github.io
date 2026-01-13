import PageTitle from "../../../components/PageTitle";
import Wedstrijd from "./components/Wedstrijd.tsx";
import "./Hoogtepunten.scss";
import Wedstrijden from "../../../content/Hoogtepunten.json";

interface Prijs {
  plaats: number;
  naam: string;
  afstand: string;
}

interface HoogtepuntItem {
  wedstrijd: string;
  foto: string;
  prijzen: Prijs[];
  prestaties: string[];
}

const Hoogtepunten = () => {
    return (
        <>
            <PageTitle title="Hoogtepunten"/>
            {Wedstrijden.wedstrijden.map((item: HoogtepuntItem) => {
                return <Wedstrijd key={item.wedstrijd} naam={item.wedstrijd} foto={item.foto} prijzen={item.prijzen} prestaties={item.prestaties}/>
            })}
        </>
    )
}

export default Hoogtepunten;
