import React from "react";
import Nieuwsbericht from "./Nieuwsbericht/Nieuwsbericht";
import PageTitle from "../../components/PageTitle";

function Nieuws() {
    return(
        <div class="text-center">
            <PageTitle title="Laatste nieuws"/>
            <Nieuwsbericht position="left"/>
            <Nieuwsbericht position="right"/>
            <Nieuwsbericht position="left"/>
            <button class="transition duration-500 border-4 p-4 m-8 border-blauw border-opacity-90 text-blauw text-opacity-90 text-3xl font-bold rounded-lg transform hover:text-white hover:bg-opacity-90 hover:border-white hover:bg-blauw">
                ARCHIEF
            </button>
        </div>
        
    )
}

export default Nieuws;