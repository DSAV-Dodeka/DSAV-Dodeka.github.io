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