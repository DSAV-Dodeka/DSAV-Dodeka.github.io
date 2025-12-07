import PageTitle from "../../../components/PageTitle";
import Wedstrijd from "./components/Wedstrijd";
import "./Hoogtepunten.scss";
import Wedstrijden from "../../../content/Hoogtepunten.json";

interface HoogtepuntItem {
  wedstrijd: string;
  foto: string;
  prijzen: any[];
  prestaties: any[];
}

const Hoogtepunten = () => {
    return (
        <>
            <PageTitle title="Hoogtepunten"/>
            {Wedstrijden.wedstrijden.map((item: HoogtepuntItem) => {
                return <Wedstrijd naam={item.wedstrijd} foto={item.foto} prijzen={item.prijzen} prestaties={item.prestaties}/>
            })}
        </>
    )
}

export default Hoogtepunten;
