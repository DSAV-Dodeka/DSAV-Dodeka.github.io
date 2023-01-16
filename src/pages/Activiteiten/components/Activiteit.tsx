import React from "react";
import {
    Link
} from "react-router-dom";
import "../../Wedstrijden/Wedstrijden/components/EigenWedstrijd.scss";
import getUrl from "../../../functions/links";

type Activiteit =  {
    oud: boolean,
    naam: string,
    info_kort: string
    datum: string
    logo: string,
    path: string
    typePath: "wedstrijden"|"vereniging/activiteiten"
}
function Activiteit(props: Activiteit) {
    return(
        <div className={"eigenWedstrijd" + (props.oud ? " eigenWedstrijdOud" : "")}>
            <p className="eigenWedstrijdNaam">{props.naam}</p>
            <p className={"eigenWedstrijdDatum" + (props.oud ? " eigenWedstrijdDatumOud" : "")}>{props.datum}</p>
            <img className="eigenWedstrijdFoto" src={getUrl(`${props.typePath}/${props.logo}`)} alt=""/>
            <p className="eigenWedstrijdInfo">{props.info_kort}</p>
            {props.path === "" ? "" : <Link to={"/" + props.typePath + props.path}><h1 className={"eigenWedstrijdLink" + (props.oud ? " eigenWedstrijdLinkOud" : "")}>Bekijk {props.typePath == "wedstrijden" ? "wedstrijd" : "activiteit"}</h1></Link>}
        </div>
    )
}

export default Activiteit;