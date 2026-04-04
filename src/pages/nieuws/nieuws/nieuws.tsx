import { useState } from "react";
import Nieuwsbericht from "./components/Nieuwsbericht";
import PageTitle from "../../../components/PageTitle";
import { getAllNieuwsberichten } from "$functions/nieuws.ts";
import "./Nieuws.scss";

function Nieuws() {
    const nieuwsberichten = getAllNieuwsberichten();
    const [nBerichten, setNBerichten] = useState(3);

    return(
        <div id="nieuwsContainer" className="text-center">
            <PageTitle title="Nieuws"/>
            <div className={"nieuwsberichten1" + (nBerichten >= nieuwsberichten.length ? " nieuwsberichten2" : "")}>
            {nieuwsberichten.slice(0, nBerichten).map((bericht, index) =>
                    <Nieuwsbericht key={bericht.id} position={index % 2 === 0 ? "left" : "right"} page="nieuws" id={bericht.id} titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            </div>

            <button onClick={() => setNBerichten(nBerichten + 3)} className={"nieuwsberichten3" + (nBerichten >= nieuwsberichten.length ? " hidden" : "")}>
                LAAD MEER
            </button>
        </div>

    )
}

export default Nieuws;