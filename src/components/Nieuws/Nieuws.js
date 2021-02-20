import React from "react";
import Nieuwsbericht from "./Nieuwsbericht/Nieuwsbericht"

function Nieuws() {
    return(
        <div class="text-center">
            <h1 class="text-left text-5xl text-dsav_blauw ml-16 mt-8 font-bold">Laatste Nieuws</h1>
            <Nieuwsbericht position="left"/>
            <Nieuwsbericht position="right"/>
            <Nieuwsbericht position="left"/>
            <button class="border-4 p-4 m-8 border-dsav_blauw border-opacity-90 text-dsav_blauw text-opacity-90 text-3xl font-bold rounded-lg">
                Archief
            </button>
        </div>
        
    )
}

export default Nieuws;