import React, { useState } from "react";
import Nieuwsbericht from "../Nieuws/components/Nieuwsbericht";
import SpikeText from "../../content/Spike.json";
import logo from "../../images/spike/logo.png";
import "./Spike.scss";

function Spike() {
    const [nBerichten, setNBerichten] = useState(3);

    return(
        <div className="spikeContainer">
            <div className="spikeLogoContainer">
                <img src={logo} alt="De Spike" className="spike_1"/>
            </div>
            <div className={"spike_2" + (nBerichten >= SpikeText.nieuwsberichten.length ? " spike_3" : "")}>
            {SpikeText.nieuwsberichten.slice(0, nBerichten).map((bericht, index) =>
                    <Nieuwsbericht key={bericht.titel} position={index % 2 === 0 ? "left" : "right"} page="spike" titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            </div>
            
            <button onClick={() => setNBerichten(nBerichten + 3)} className={"spike_4" + (nBerichten >= SpikeText.nieuwsberichten.length ? " hidden" : "")}>
                LAAD MEER
            </button>
        </div>
        
    )
}

export default Spike;