import React, { useState } from "react";
import Nieuwsbericht from "../Nieuws/components/Nieuwsbericht";
import PageTitle from "../../components/PageTitle";
import SpikeText from "../../content/Spike.json";
import logo from "../../images/spike/logo.png";

function Spike() {
    const [nBerichten, setNBerichten] = useState(3);

    return(
        <div class="text-center">
            <img src={logo} alt="De Spike" class="ml-4 lg:ml-14 my-4 lg:my-8 w-40"/>
            <div class={"space-y-8 lg:space-y-24 mb-4 lg:mb-12" + (nBerichten >= SpikeText.nieuwsberichten.length ? " mb-8 lg:mb-24" : "")}>
            {SpikeText.nieuwsberichten.slice(0, nBerichten).map((bericht, index) =>
                    <Nieuwsbericht position={index % 2 === 0 ? "left" : "right"} page="spike" titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            </div>
            
            <button onClick={() => setNBerichten(nBerichten + 3)} class={"bg-rood text-white text-xl font-bold rounded-xl py-2 px-4 lg:py-4 mb-4 lg:mb-12" + (nBerichten >= SpikeText.nieuwsberichten.length ? " hidden" : "")}>
                LAAD MEER
            </button>
        </div>
        
    )
}

export default Spike;