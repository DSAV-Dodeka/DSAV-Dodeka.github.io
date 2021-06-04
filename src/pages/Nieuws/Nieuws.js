import React from "react";
import Nieuwsbericht from "./components/Nieuwsbericht";
import PageTitle from "../../components/PageTitle";
import NieuwsText from "../../content/Nieuws.json";

function Nieuws() {
    return(
        <div class="text-center">
            <PageTitle title="Nieuws"/>
            {NieuwsText.nieuwsberichten.map((bericht, index) =>
                    <Nieuwsbericht position={index % 2 === 0 ? "left" : "right"} titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            <button class="transition duration-500 border-4 p-4 m-8 border-blauw border-opacity-90 text-blauw text-opacity-90 text-3xl font-bold rounded-lg transform hover:text-white hover:bg-opacity-90 hover:border-white hover:bg-blauw">
                ARCHIEF
            </button>
        </div>
        
    )
}

export default Nieuws;