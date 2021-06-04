import React, { useState } from "react";
import Nieuwsbericht from "./components/Nieuwsbericht";
import PageTitle from "../../components/PageTitle";
import NieuwsText from "../../content/Nieuws.json";

function Nieuws() {
    const [nBerichten, setNBerichten] = useState(3);

    return(
        <div class="text-center">
            <PageTitle title="Nieuws"/>
            <div class={"space-y-24 mb-12" + (nBerichten >= NieuwsText.nieuwsberichten.length ? " mb-24" : "")}>
            {NieuwsText.nieuwsberichten.slice(0, nBerichten).map((bericht, index) =>
                    <Nieuwsbericht position={index % 2 === 0 ? "left" : "right"} titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            </div>
            
            <button onClick={() => setNBerichten(nBerichten + 3)} class={"bg-rood text-white text-3xl font-bold rounded-xl p-4 mb-12" + (nBerichten >= NieuwsText.nieuwsberichten.length ? " hidden" : "")}>
                ARCHIEF
            </button>
        </div>
        
    )
}

export default Nieuws;