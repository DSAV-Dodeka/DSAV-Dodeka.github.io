import React from "react";
import "./Contactinfo.scss"

function Contactinfo() {
    return (
        <div id="info">
            <h1 className="contact-type">E-mail</h1>
            <div><a href="mailto:bestuur@dsavdodeka.nl" className="contact-value">bestuur@dsavdodeka.nl</a></div>
            <h1 className="contact-type">Adres</h1>
            <h1 className="contact-value">Sportring 12, 2616LK Delft</h1>

        </div>
    )
}

export default Contactinfo;