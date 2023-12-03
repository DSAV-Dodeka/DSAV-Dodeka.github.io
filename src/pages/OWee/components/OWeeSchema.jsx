import React from "react";
import "./OWeeSchema.scss";

function OWeeSchema() {
    return(
        <div className="OWeeSchema">
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Maandag</h1>
                <h1 className="OWeeDatum">14 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Training</h1>
                    <p className="OWeeActiviteitTijd">18:00-19:30</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Driekamp</h1>
                    <p className="OWeeActiviteitTijd">20:00-22:00</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is, alle atletiekonderdelen komen aan bod!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Borrel</h1>
                    <p className="OWeeActiviteitTijd">22:00-23:30</p>
                    <p className="OWeeActiviteitOmschrijving">Na het sporten zijn we allemaal wel toe aan een drankje. Blijf gezellig borrelen en leer je mede-eerstejaars en de leden van Dodeka nog beter kennen!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Dinsdag</h1>
                <h1 className="OWeeDatum">15 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Mario Krat</h1>
                    <p className="OWeeActiviteitTijd">12:00-16:00</p>
                    <p className="OWeeActiviteitOmschrijving">Versier je eigen Mario krat en race een rondje om de atletiekbaan!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Woensdag</h1>
                <h1 className="OWeeDatum">16 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Training</h1>
                    <p className="OWeeActiviteitTijd">18:15-19:45</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Borrel</h1>
                    <p className="OWeeActiviteitTijd">19:45-21:00</p>
                    <p className="OWeeActiviteitOmschrijving">Na een zware training gaan we met z'n allen lekker eten en wat drinken om ons weer op te laden voor het TRACK festival. Eet gezellig een hapje mee of doe een drankje met onze leden!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">TRACK Festival</h1>
                    <p className="OWeeActiviteitTijd">21:00-01:00</p>
                    <p className="OWeeActiviteitOmschrijving">Kom gezellig feesten op hét D.S.A.V. Dodeka feest op de atletiekbaan! We maken ook het thema bekend van ons allereerste lustrumjaar!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Donderdag</h1>
                <h1 className="OWeeDatum">17 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Spetterdag</h1>
                    <p className="OWeeActiviteitTijd">10:00-......</p>
                    <p className="OWeeActiviteitOmschrijving">Na een zware week sluiten we de OWee af met een uitbrakdag. Kom rustig chillen en bijkomen in zwembadjes en geniet na van een geweldige OWee!</p>
                </div>
            </div>
            
        </div>
    )
}

export default OWeeSchema;