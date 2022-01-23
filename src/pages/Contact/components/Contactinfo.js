import React from "react";
import "./Contactinfo.scss"

function Contactinfo() {
    return (
        <div id="info">
            <h1 class="contact-type">E-mail</h1>
            <div><a href="mailto:bestuur@dsavdodeka.nl" class="contact-value">bestuur@dsavdodeka.nl</a></div>
            <h1 class="contact-type">Adres</h1>
            <h1 class="contact-value">Sportring 12, 2616LK Delft</h1>
            <h1 class="contact-type">AV`40 Website</h1>
            <div><a target="_blank" rel="noreferrer" href="https://www.av40.nl" class="contact-value">www.av40.nl</a></div>

        </div>
    )
}

export default Contactinfo;