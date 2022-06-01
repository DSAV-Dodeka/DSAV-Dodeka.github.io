import React from "react";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import {
    Link
} from "react-router-dom";
import "./EigenWedstrijd.scss";
import getUrl from "../../../functions/links";

function EigenWedstrijd(props) {
    return(
        <div className="eigenWedstrijd">
            <p className="eigenWedstrijdNaam">{props.naam}</p>
            <p className="eigenWedstrijdDatum">{props.datum}</p>
            <img className="eigenWedstrijdFoto" src={getUrl(`wedstrijden/${props.logo}`)} alt=""/>
            <p className="eigenWedstrijdInfo">{props.info_kort}</p>
            {props.path === "" ? "" : <Link to={"/wedstrijden" + props.path}><h1 className="eigenWedstrijdLink">Bekijk wedstrijd</h1></Link>}
        </div>
    )
}

export default EigenWedstrijd;