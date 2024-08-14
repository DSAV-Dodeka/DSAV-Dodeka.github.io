import React from "react";
import "./OWeeSchema.scss";

function OWeeSchema() {
    return(
        <div className="OWeeSchema">
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Zondag</h1>
                <h1 className="OWeeDatum">14 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Parade</h1>
                    <p className="OWeeActiviteitTijd">17:30-18:30</p>
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
                <h1 className="OWeeDatum">15 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Infomarkt</h1>
                    <p className="OWeeActiviteitTijd">13:00-17:45</p>
                    <p className="OWeeActiviteitOmschrijving">Kom langs bij onze stand op de Grote Markt en leer meer over wat wij allemaal doen en hoe leuk Dodeka is. Ook zijn er challenges waar je prijzen mee kan winnen!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Training</h1>
                    <p className="OWeeActiviteitTijd">18:00-19:30</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">KICK-OFF</h1>
                    <p className="OWeeActiviteitTijd">19:30-23:30</p>
                    <p className="OWeeActiviteitOmschrijving">Na de training gaan we eten, borrelen en daarbij gaan we epische spelletjes doen! Kom vooral langs, proef de sfeer en leer de mensen kennen.</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Dinsdag</h1>
                <h1 className="OWeeDatum">16 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">OWlympics</h1>
                    <p className="OWeeActiviteitTijd">10:30-17:30</p>
                    <p className="OWeeActiviteitOmschrijving">Tijdens het verenigingsbezoek kan je lekker bij ons sporten! Probeer technische onderdelen zoals hordelopen, kogelstoten of hoogspringen. Ook gaan we proberen wereldrecords te verbreken op verschillende loopafstanden! Om het wat makkelijker te maken doen we dit in estafettevorm.</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Sportfeest bij Proteus</h1>
                    <p className="OWeeActiviteitTijd">21:00-3:30</p>
                    <p className="OWeeActiviteitOmschrijving">Dodeka mag natuurlijk niet ontbreken op het sportfeest bij Proteus!</p>
                </div>
            </div>
            <div className="OWeeDag">
                <h1 className="OWeeDatumDag">Woensdag</h1>
                <h1 className="OWeeDatum">17 augustus</h1>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Activiteitenmarkt bij X</h1>
                    <p className="OWeeActiviteitTijd">12:00-15:00</p>
                    <p className="OWeeActiviteitOmschrijving">Ook op de activiteitenmarkt zijn wij natuurlijk aanwezig. Hier kan je al je vragen stellen en ook weer atletiek uitproberen!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Training</h1>
                    <p className="OWeeActiviteitTijd">18:15-19:45</p>
                    <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                </div>
                <div className="OWeeActiviteit">
                    <h1 className="OWeeActiviteitNaam">Try-outs en TRACKborrel</h1>
                    <p className="OWeeActiviteitTijd">19:45-23:30</p>
                    <p className="OWeeActiviteitOmschrijving">Na de training gaan we eten, borrelen en ook is er nog de mogelijkheid om het onderdeel te proberen wat je altijd al eens hebt willen doen. Daarnaast is er weer een supergezellige borrel in de kantine, dus wees erbij!</p>
                </div>
            </div>
            
        </div>
    )
}

export default OWeeSchema;