import React from "react";
import "./Verjaardag.scss";

function Verjaardag(props) {
    return (
        <div className="verjaardag_container">
            <p className="verjaardag_datum">{props.datum}</p>
            <p className="verjaardag_datum_mobile">{props.dag}</p>
            <p className="verjaardag_naam">{props.voornaam + " " + props.achternaam}</p>
            <p className="verjaardag_leeftijd">{props.leeftijd + " jaar"}</p>
        </div>
    )
}

export default Verjaardag;