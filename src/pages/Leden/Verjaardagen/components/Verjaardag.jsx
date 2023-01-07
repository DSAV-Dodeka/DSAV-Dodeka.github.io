import React from "react";
import "./Verjaardag.scss";

function Verjaardag(props) {
    return (
        <div className="verjaardag_container">
            <p className="verjaardag_datum">{props.datum}</p>
            <p>{props.voornaam} <br className="mobile_break"/>{props.achternaam}</p>
            <p className="verjaardag_leeftijd">{props.leeftijd + " jaar"}</p>
        </div>
    )
}

export default Verjaardag;