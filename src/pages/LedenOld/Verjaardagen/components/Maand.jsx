import React from "react";
import "./Maand.scss";

function Maand(props) {
    return (
        <p className="maand">
            {props.maand}
        </p>
    )
}

export default Maand;