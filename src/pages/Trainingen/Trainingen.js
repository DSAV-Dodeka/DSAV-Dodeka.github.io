import React from "react";
import PageTitle from "../../components/PageTitle";
import Trainingstijden from "./components/Trainingstijden";
import Trainingsinfo from "./components/Trainingsinfo";
import Icons from "./components/Icons";
import Baanatletiek from "./components/Baanatletiek";
import Loopgroep from "./components/Loopgroep";

function Trainingen() {
    return (
        <div>
            <PageTitle title="Trainingen" />
            <Trainingstijden />
            <Trainingsinfo />
            <Baanatletiek />
            <Icons />
            <Loopgroep />
        </div>
    )
}

export default Trainingen;