import React from "react";
import "./OWeeSchema.scss";

function OWeeSchema() {
    return(
        <div className="OWeeSchema">
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Zondag</h1>
                <h1 className="OWeeDatum">17 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Parade</h1>
                    <p className="OWeeActiviteitTijd">14:30-20:00</p>
                    <p className="OWeeActiviteitOmschrijving">Spot ons bij de parade tijdens het Schiediner, waar we herkenbaar zullen zijn aan onze donkerblauwe shirts!</p>
                </div>
                {/* <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Driekamp</h1>
                    <p className="OWeeActiviteitTijd">20:00-22:00</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is, alle atletiekonderdelen komen aan bod!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Borrel</h1>
                    <p className="OWeeActiviteitTijd">22:00-23:30</p>
                    <p className="OWeeActiviteitOmschrijving">Na het sporten zijn we allemaal wel toe aan een drankje. Blijf gezellig borrelen en leer je mede-eerstejaars en de leden van Dodeka nog beter kennen!</p>
                </div> */}
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Maandag</h1>
                <h1 className="OWeeDatum">18 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Infomarkt</h1>
                    <p className="OWeeActiviteitTijd">11:15-18:30</p>
                    <p className="OWeeActiviteitOmschrijving">Kom langs bij onze stand op de Grote Markt en leer meer over wat wij allemaal doen en hoe leuk Dodeka is. Ook zijn er challenges waar je prijzen mee kan winnen!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Training</h1>
                    <p className="OWeeActiviteitTijd">18:15-19:45</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Dinsdag</h1>
                <h1 className="OWeeDatum">19 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">OWaterlympics</h1>
                    <p className="OWeeActiviteitTijd">overdag (tijd volgt)</p>
                    <p className="OWeeActiviteitOmschrijving">Kom tijdens de OWaterlympics een sprintje trekken op onze sprintmat! Deze activiteit zal plaatsvinden in Delftse Hout.</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Sportfeest bij Proteus</h1>
                    <p className="OWeeActiviteitTijd">20:00-00:00</p>
                    <p className="OWeeActiviteitOmschrijving">Dodeka mag natuurlijk niet ontbreken op het sportfeest bij Proteus!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Woensdag</h1>
                <h1 className="OWeeDatum">20 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Activiteitenmarkt bij X</h1>
                    <p className="OWeeActiviteitTijd">9:30-16:00</p>
                    <p className="OWeeActiviteitOmschrijving">Ook op de activiteitenmarkt zijn wij natuurlijk aanwezig. Hier kan je al je vragen stellen en ook weer atletiek uitproberen!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Training</h1>
                    <p className="OWeeActiviteitTijd">18:15-19:45</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">TRACKfestival</h1>
                    <p className="OWeeActiviteitTijd">20:00-23:00</p>
                    <p className="OWeeActiviteitOmschrijving">Blijf na de training hangen voor deze epische jaarlijkse OWee evenement!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Donderdag</h1>
                <h1 className="OWeeDatum">21 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Delftse Hout relax</h1>
                    <p className="OWeeActiviteitTijd">10:00-13:00</p>
                    <p className="OWeeActiviteitOmschrijving">Kom na een drukke OWee week lekker relaxen met ons in Delftse Hout.</p>
                </div>
            </div>
        </div>
    )
}

export default OWeeSchema;