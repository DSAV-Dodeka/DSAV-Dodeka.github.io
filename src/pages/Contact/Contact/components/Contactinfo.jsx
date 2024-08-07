import React from "react";
import "./Contactinfo.scss"

function Contactinfo() {
    return (
        <div id="info">
            <h1 className="contact-type">E-mail</h1>
            <div><a href="mailto:studentenatletiek@av40.nl" className="contact-value">studentenatletiek@av40.nl</a></div>
            <h1 className="contact-type">Adres</h1>
            <h1 className="contact-value">Sportring 12, 2616LK Delft</h1>
            <h1 className="contact-type">AV'40 Website</h1>
            <div><a target="_blank" rel="noreferrer" href="https://www.av40.nl" className="contact-value">www.av40.nl</a></div>

        </div>
    )
}

export default Contactinfo;