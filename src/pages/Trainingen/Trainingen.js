import React from "react";
import PageTitle from "../../components/PageTitle";
import Trainingstijden from "./components/Trainingstijden";
import Trainingsinfo from "./components/Trainingsinfo";
import Icons from "./components/Icons";
import Baanatletiek from "./components/Baanatletiek";
import Loopgroep from "./components/Loopgroep";
import Text from "../../content/Trainingen.json";

function Trainingen() {
    return (
        <div>
            <div class="h-16 bg-rood text-center text-white text-xl align-middle content-center">
                <p class="py-4">Let op! Vanwege de huidige coronamaatregelen zijn de trainingen tijdelijk op maandag en woensdag van 15:00 tot 16:30 en op zaterdag van 10:30 tot 12:00. </p>
            </div>
            <PageTitle title="Trainingen" />
            <Trainingstijden />
            <Trainingsinfo text={Text.algemeen.tekst}/>
            <Baanatletiek text={Text.baanatletiek.tekst} foto={Text.baanatletiek.foto}/>
            <Icons />
            <Loopgroep text={Text.loopgroep.tekst} foto={Text.loopgroep.foto}/>
        </div>
    )
}

export default Trainingen;