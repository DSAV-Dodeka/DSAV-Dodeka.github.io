import React from "react";
import PageTitle from "../../components/PageTitle";
import indoor from "../../images/wedstrijden/nsk_indoor_logo.jpg";
import WedstrijdAlgemeen from "./components/WedstrijdAlgemeen";
import WedstrijdBelangrijk from "./components/WedstrijdBelangrijk";
import "./Wedstrijd.scss";

function Wedstrijd(props) {
    return(
        <div>
            <PageTitle title={props.wedstrijd.naam}/>
            <div className="wedstrijd_container">
                <img className="wedstrijd_logo" src={require(`../../images/wedstrijden/${props.wedstrijd.logo_rond}`).default} alt =""/>
                <WedstrijdAlgemeen wedstrijd={props.wedstrijd}/>
                <WedstrijdBelangrijk wedstrijd={props.wedstrijd}/>
            </div>
        </div>
    )
}

export default Wedstrijd;