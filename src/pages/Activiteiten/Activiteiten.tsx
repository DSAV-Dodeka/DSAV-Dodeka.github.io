import React from "react";


import PageTitle from "../../components/PageTitle";
import TextActiviteiten from "../../content/Activiteiten.json"
import "../Wedstrijden/Wedstrijden/Wedstrijden.scss"
import { wedstrijdGeweest } from "../Wedstrijden/Wedstrijden/Wedstrijden";
import Activiteit from "./components/Activiteit";

function Activiteiten() {
    return(
        <div>
            <PageTitle title="Activiteiten"/>
            <div id="eigenWedstrijden">
                {TextActiviteiten.wedstrijden.map(wedstrijd =>
                    <Activiteit key={wedstrijd.naam + wedstrijd.datum} naam={wedstrijd.naam} datum={wedstrijd.datum} logo={wedstrijd.logo} info_kort={wedstrijd.info_kort} path={wedstrijd.path} oud={wedstrijdGeweest(wedstrijd.datum)} typePath={"vereniging/activiteiten"} />
                )}
            </div>
        </div>
    )
}

export default Activiteiten;