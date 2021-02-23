import React from "react";
import Nieuwsbericht from "./Nieuwsbericht/Nieuwsbericht";
import PageTitle from "../Shared/PageTitle";

function Nieuws() {
    return(
        <div class="text-center">
            <PageTitle title="Laatste nieuws"/>
            <Nieuwsbericht position="left"/>
            <button class="border-4 p-4 m-8 border-dsav_blauw border-opacity-90 text-dsav_blauw text-opacity-90 text-3xl font-bold rounded-lg">
                ARCHIEF
            </button>
        </div>
        
    )
}

export default Nieuws;