import React from "react";
import PageTitle from "../../components/PageTitle";
import indoor from "../../images/wedstrijden/nsk_indoor_logo.jpg";
import WedstrijdAlgemeen from "./components/WedstrijdAlgemeen";
import WedstrijdBelangrijk from "./components/WedstrijdBelangrijk";
import "./Wedstrijd.scss";

function Wedstrijd() {
    return(
        <div>
            <PageTitle title="NSK Indoor"/>
            <div className="wedstrijd_container">
                <img className="wedstrijd_logo" src={indoor} alt =""/>
                <WedstrijdAlgemeen />
                <WedstrijdBelangrijk />
            </div>
            
        </div>
    )
}

export default Wedstrijd;