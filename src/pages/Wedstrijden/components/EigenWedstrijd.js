import React from "react";
import {
    HashLink as Link
} from "react-router-hash-link";
import "./EigenWedstrijd.scss";

function EigenWedstrijd(props) {
    return(
        <div className="eigenWedstrijd">
            <p className="eigenWedstrijdNaam">{props.naam}</p>
            <p className="eigenWedstrijdDatum">{props.datum}</p>
            <img className="eigenWedstrijdFoto" src={require(`../../../images/wedstrijden/${props.logo}`).default} alt=""/>
            <p className="eigenWedstrijdInfo">{props.info_kort}</p>
            {props.path === "" ? "" : <Link to={"/wedstrijden" + props.path}><h1 className="eigenWedstrijdLink">Bekijk wedstrijd</h1></Link>} 
        </div>
    )
}

export default EigenWedstrijd;