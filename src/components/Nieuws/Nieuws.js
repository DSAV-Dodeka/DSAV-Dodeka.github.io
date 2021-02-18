import React from "react";
import Nieuwsbericht from "./Nieuwsbericht/Nieuwsbericht"

function Nieuws() {
    return(
        <div class="inline">
            <h1 class="text-5xl text-dsav_blauw ml-16 mt-8 font-bold">Laatste Nieuws</h1>
            <Nieuwsbericht />
            <Nieuwsbericht />
            <Nieuwsbericht />
            <Nieuwsbericht />
        </div>
        
    )
}

export default Nieuws;