import "./OWeeSchema.scss";
import { useState } from "react";

function OWeeSchema() {
    const [showPopup, setShowPopup] = useState<string | null>(null);
    
    return(
        <div className="OWeeSchema">
            <h1 className="OWeeHeader">OWEE PLANNING D.S.A.V DODEKA</h1>
            <div className={showPopup ? "planning hidden" : "planning"}>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Zondag</h1>
                    <h1 className="OWeeDatum">16 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Parade")}>
                        <h1 className="OWeeActiviteitNaam">Parade</h1>
                        <p className="OWeeActiviteitTijd">16:45-19:00 - Langs de Schie</p>
                        <p className="OWeeActiviteitOmschrijving">Spot ons bij de parade tijdens het Schiediner, waar we herkenbaar zullen zijn aan onze donkerblauwe shirts!</p>
                    </div>
                    { <div className="OWeeActiviteit" onClick={() => setShowPopup("Feest")}>
                        <h1 className="OWeeActiviteitNaam">Openingsfeest</h1>
                        <p className="OWeeActiviteitTijd">20:00 - Tu Delft Aula</p>
                        <p className="OWeeActiviteitOmschrijving">Kom lekker feesten met Dodeka!</p>
                    </div>
                /* <div className="OWeeActiviteit">
                        <h1 className="OWeeActiviteitNaam">Borrel</h1>
                        <p className="OWeeActiviteitTijd">22:00-23:30</p>
                        <p className="OWeeActiviteitOmschrijving">Na het sporten zijn we allemaal wel toe aan een drankje. Blijf gezellig borrelen en leer je mede-eerstejaars en de leden van Dodeka nog beter kennen!</p>
                    </div> */}
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Maandag</h1>
                    <h1 className="OWeeDatum">17 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Infomarkt")}>
                        <h1 className="OWeeActiviteitNaam">Infomarkt</h1>
                        <p className="OWeeActiviteitTijd">13:00-17:45 - Grote Markt</p>
                        <p className="OWeeActiviteitOmschrijving">Kom langs bij onze stand op de Grote Markt en leer meer over wat wij allemaal doen en hoe leuk Dodeka is. Ook zijn er challenges waar je prijzen mee kan winnen!</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Training")}>
                        <h1 className="OWeeActiviteitNaam">Training</h1>
                        <p className="OWeeActiviteitTijd">18:15-19:45 - Sportring 12</p>
                        <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Dinsdag</h1>
                    <h1 className="OWeeDatum">19 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Runclub")}>
                        <h1 className="OWeeActiviteitNaam">Runclub</h1>
                        <p className="OWeeActiviteitTijd">10:30-11:30 - Grote Markt</p>
                        <p className="OWeeActiviteitOmschrijving">Loop een rondje mee door Delft en geniet van de snacks onderweg!</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Sportfeest")}>
                        <h1 className="OWeeActiviteitNaam">Sportfeest bij Proteus</h1>
                        <p className="OWeeActiviteitTijd">20:30 - Rotterdamseweg 362a</p>
                        <p className="OWeeActiviteitOmschrijving">Dodeka mag natuurlijk niet ontbreken op het sportfeest bij Proteus!</p>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Woensdag</h1>
                    <h1 className="OWeeDatum">20 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Act_markt")}>
                        <h1 className="OWeeActiviteitNaam">Activiteitenmarkt bij X</h1>
                        <p className="OWeeActiviteitTijd">11:00-15:00 - Op X</p>
                        <p className="OWeeActiviteitOmschrijving">Ook op de activiteitenmarkt zijn wij natuurlijk aanwezig. Hier kan je al je vragen stellen en ook weer atletiek uitproberen!</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Training")}>
                        <h1 className="OWeeActiviteitNaam">Training</h1>
                        <p className="OWeeActiviteitTijd">18:15-19:45 - Sportring 12</p>
                        <p className="OWeeActiviteitOmschrijving">Train gezellig mee en kijk of atletiek bij Dodeka iets voor jou is!</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Borrel")}>
                        <h1 className="OWeeActiviteitNaam">Borrel</h1>
                        <p className="OWeeActiviteitTijd">20:00-23:00 - Sportring 12</p>
                        <p className="OWeeActiviteitOmschrijving">Kom gezellig borrelen na de training!</p>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Donderdag</h1>
                    <h1 className="OWeeDatum">21 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Chilldag")}>
                        <h1 className="OWeeActiviteitNaam">Delftse Hout relax</h1>
                        <p className="OWeeActiviteitTijd">11:30:00-13:00 - Delftse Hout</p>
                        <p className="OWeeActiviteitOmschrijving">Kom na een drukke OWee week lekker relaxen met ons in Delftse Hout.</p>
                    </div>
                </div>
            </div>
            {/* Parade popup */}
            {showPopup !== null && (
                <div className="popup">
                    <div
                        className="closePopup"
                        onClick={() => setShowPopup(null)}
                    ></div>
                    {/* Parade popup */}
                    {showPopup === "Parade" && (
                        <>
                        <h1>Parade</h1>
                        <p>This is the content for the owee</p>
                        </>
                    )}
                    {/* Feest popup */}
                    {showPopup === "Feest" && (
                        <>
                        <h1>Feest</h1>
                        <p>This is the content for the Feest</p>
                        </>
                    )}
                    {/* Infomarkt popup */}
                    {showPopup === "Infomarkt" && (
                        <>
                        <h1>Infomarkt</h1>
                        <p>This is the content for the infomarkt</p>
                        </>
                    )}
                    {/* Training popup */}
                    {showPopup === "Training" && (
                        <>
                        <h1>Training</h1>
                        <p>This is the content for the training</p>
                        </>
                    )}
                    {/* Runclub popup */}
                    {showPopup === "Runclub" && (
                        <>
                        <h1>Runclub</h1>
                        <p>This is the content for the runclub</p>
                        </>
                    )}
                    {/* Sportfeest popup */}
                    {showPopup === "Sportfeest" && (
                        <>
                        <h1>Sportfeest</h1>
                        <p>This is the content for the Sportfeest</p>
                        </>
                    )}
                    {/* Activiteiten markt popup */}
                    {showPopup === "Act_markt" && (
                        <>
                        <h1>Activiteiten markt</h1>
                        <p>This is the content for the acgtiviteiten markt</p>
                        </>
                    )}
                    {/* Chilldag popup */}
                    {showPopup === "Chilldag" && (
                        <>
                        <h1>Chilldag</h1>
                        <p>This is the content for the Chilldag</p>
                        </>
                    )}
                    {/* Borrel popup */}
                    {showPopup === "Borrel" && (
                        <>
                        <h1>Borrel</h1>
                        <p>This is the content for the Borrel</p>
                        </>
                    )}
                </div>
                
            )}
            
        </div>
    )
}

export default OWeeSchema;