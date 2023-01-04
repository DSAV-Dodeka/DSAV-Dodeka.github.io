import React from "react";
import PageTitle from "../../../components/PageTitle";
import WedstrijdAlgemeen from "./components/WedstrijdAlgemeen";
import WedstrijdBelangrijk from "./components/WedstrijdBelangrijk";
import "./Wedstrijd.scss";
import getUrl from "../../../functions/links";

function Wedstrijd(props) {
    return(
        <div>
            <PageTitle title={props.wedstrijd.naam}/>
            <div className="wedstrijd_container">
                {props.wedstrijd.logo_rond === "" ? "" : <img className="wedstrijd_logo" src={getUrl(`wedstrijden/${props.wedstrijd.logo_rond}`)} alt =""/>}
                <WedstrijdAlgemeen wedstrijd={props.wedstrijd}/>
                <WedstrijdBelangrijk wedstrijd={props.wedstrijd}/>
            </div>
        </div>
    )
}

export default Wedstrijd;