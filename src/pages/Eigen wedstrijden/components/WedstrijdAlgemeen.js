import React from "react";
import "./WedstrijdAlgemeen.scss";
import indoor from "../../../images/wedstrijden/nsk_indoor_algemeen.jpeg";

function Wedstrijd() {
    return(
        <div className="wedstrijd_algemeen">
            <img className="wedstrijd_algemeen_foto" alt="" src={indoor}/>
            <p class="wedstrijd_algemeen_info">Welkom op de pagina van de Nederlandse Studenten Kampioenschappen Indoor 2022, dat georganiseerd wordt door D.S.A.V. Dodeka! Ondanks de moeilijke en onzekere situatie wat betreft het coronavirus, is het gelukkig toch mogelijk om deze kampioenschappen te organiseren op 12 maart in Omnisport te Apeldoorn. <br/><br/>
            Het zal een volle dag van ongeveer 11 tot 19 uur worden, waarbij je heerlijk mee kunt doen aan wedstrijden van verschillende onderdelen. Denk hierbij aan diverse loopafstanden, hordelopen, kogelstoten, hoogspringen en nog zoveel meer (klik op inschrijven om alle onderdelen te bekijken)!<br/><br/>
            Iedere student die wedstrijdlid is bij de atletiekunie kan aan deze wedstrijd meedoen. Hiervoor dien je wel een bewijs van inschrijving aan je onderwijsinstelling te uploaden via de form op de inschrijfpagina. Ook voor niet-studenten is het mogelijk om mee te doen indien er nog genoeg startplekken zijn.<br/><br/>
            Wij zijn altijd op zoek naar ervaren en/of enthousiaste vrijwilligers. Opgeven kan via <a className="wedstrijd_algemeen_link" href="https://forms.gle/Z5KiQPmQCpaBF5828" target="_blank" rel="noreferrer">dit formulier</a>.<br/><br/>
            Door de huidige coronamaatregelen gaan wij op dit moment uit van een wedstrijd zonder eten en feest achteraf en mogelijk met beperkingen voor publiek.<br/><br/>
            Dit NSK wordt georganiseerd onder auspiciën van Studentensport Nederland, en met steun van de TU Delft. Wij willen hen hier graag voor bedanken.<br/><br/>
            We hopen dat het een onvergetelijke wedstrijd wordt en dat er veel mooie pr's zullen worden behaald. Dus schrijf je snel in en hopelijk tot dan!</p>
            <a target="_blank" rel="noreferrer" href="https://www.atletiek.nu/wedstrijd/main/36345/" className="inschrijf_button">Inschrijven</a>
        </div>
    )
}

export default Wedstrijd;