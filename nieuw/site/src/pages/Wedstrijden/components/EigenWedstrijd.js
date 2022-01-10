import React from "react";
import "./EigenWedstrijd.scss";
import indoor from "../../../images/wedstrijden/nskindoor.png";

function EigenWedstrijd(props) {
    return(
        <div class="eigenWedstrijd">
            <p class="eigenWedstrijdNaam">{props.naam}</p>
            <p class="eigenWedstrijdDatum">{props.datum}</p>
            <img class="eigenWedstrijdFoto" src={require(`../../../images/wedstrijden/${props.foto}`).default} alt=""/>
            <p class="eigenWedstrijdInfo">{props.info}</p>
            <a class="eigenWedstrijdLink" href="#">Bekijk wedstrijd</a>
        </div>
    )
}

export default EigenWedstrijd;