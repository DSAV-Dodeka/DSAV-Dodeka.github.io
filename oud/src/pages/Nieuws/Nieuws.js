import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nieuwsbericht from "./components/Nieuwsbericht";
import PageTitle from "../../components/PageTitle";
import NieuwsText from "../../content/Nieuws.json";
import spike from "../../images/nieuws/spike.svg";

function Nieuws() {
    const [nBerichten, setNBerichten] = useState(3);

    return(
        <div class="text-center">
            <PageTitle title="Nieuws"/>
            <Link to="/nieuws/spike" class="w-4 bg-rood absolute right-1 h-0 z-30"><img src={spike} alt="" class=""/></Link>
            <div class={"space-y-8 lg:space-y-24 mb-4 lg:mb-12" + (nBerichten >= NieuwsText.nieuwsberichten.length ? " mb-8 lg:mb-24" : "")}>
            {NieuwsText.nieuwsberichten.slice(0, nBerichten).map((bericht, index) =>
                    <Nieuwsbericht position={index % 2 === 0 ? "left" : "right"} page="nieuws" id={bericht.id} titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            </div>
            
            <button onClick={() => setNBerichten(nBerichten + 3)} class={"bg-rood text-white text-xl font-bold rounded-xl py-2 px-4 lg:py-4 mb-4 lg:mb-12" + (nBerichten >= NieuwsText.nieuwsberichten.length ? " hidden" : "")}>
                LAAD MEER
            </button>
        </div>
        
    )
}

export default Nieuws;