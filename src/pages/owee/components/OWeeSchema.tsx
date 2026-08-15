import "./OWeeSchema.scss";
import { useState } from "react";
import parade from "$images/owee/parade.webp";
import activiteitenmarkt from "$images/owee/activiteitenmarkt.webp";
import borrel from "$images/owee/borrel.webp";
import Chillen_op_gras from "$images/owee/Chillen_op_gras.webp";
import infomarkt from "$images/owee/infomarkt.jpeg";
import sportfeest from "$images/owee/sportfeest.webp";
import trackFestival from "$images/owee/track_festival.webp";
import training_rennen from "$images/owee/training_rennen.webp";
import run from "$images/owee/run.webp";




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
                        <p className="OWeeActiviteitTijd">16:45-19:00</p>
                        <p className="OWeeActiviteitPlaats">Langs de Schie</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                    { <div className="OWeeActiviteit" onClick={() => setShowPopup("Feest")}>
                        <h1 className="OWeeActiviteitNaam">Openingsfeest</h1>
                        <p className="OWeeActiviteitTijd">20:00-01:00</p>
                        <p className="OWeeActiviteitPlaats">Tu Delft Aula</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>}
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Maandag</h1>
                    <h1 className="OWeeDatum">17 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Infomarkt")}>
                        <h1 className="OWeeActiviteitNaam">Infomarkt</h1>
                        <p className="OWeeActiviteitTijd">13:00-17:45</p>
                        <p className="OWeeActiviteitPlaats">Grote Markt</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Training")}>
                        <h1 className="OWeeActiviteitNaam">Training</h1>
                        <p className="OWeeActiviteitTijd">18:15-19:45</p>
                        <p className="OWeeActiviteitPlaats">Sportring 12</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Dinsdag</h1>
                    <h1 className="OWeeDatum">19 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Runclub")}>
                        <h1 className="OWeeActiviteitNaam">Runclub</h1>
                        <p className="OWeeActiviteitTijd">10:30-11:30</p>
                        <p className="OWeeActiviteitPlaats">Grote Markt</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Sportfeest")}>
                        <h1 className="OWeeActiviteitNaam">Sportfeest bij Proteus</h1>
                        <p className="OWeeActiviteitTijd">20:30-03:00</p>
                        <p className="OWeeActiviteitPlaats">Rotterdamseweg 362a</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Woensdag</h1>
                    <h1 className="OWeeDatum">20 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Act_markt")}>
                        <h1 className="OWeeActiviteitNaam">Activiteitenmarkt </h1>
                        <p className="OWeeActiviteitTijd">11:00-15:00</p>
                        <p className="OWeeActiviteitPlaats">Op X</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Training")}>
                        <h1 className="OWeeActiviteitNaam">Training</h1>
                        <p className="OWeeActiviteitTijd">18:15-19:45</p>
                        <p className="OWeeActiviteitPlaats">Sportring 12</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Borrel")}>
                        <h1 className="OWeeActiviteitNaam">Borrel</h1>
                        <p className="OWeeActiviteitTijd">20:00-23:00</p>
                        <p className="OWeeActiviteitPlaats">Sportring 12</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Donderdag</h1>
                    <h1 className="OWeeDatum">21 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Chilldag")}>
                        <h1 className="OWeeActiviteitNaam">Delftse Hout relax</h1>
                        <p className="OWeeActiviteitTijd">11:30-13:00</p>
                        <p className="OWeeActiviteitPlaats">Delftse Hout</p>
                        <p className="OWeeActiviteitPlaats">Klik voor meer info</p>
                    </div>
                </div>
            </div>
            {/* Parade popup */}
            {showPopup !== null && (
                <div className="popup">
<button className="closePopup" onClick={() => setShowPopup(null)} aria-label="Sluiten">
                    ×
                </button>

                    {/* Parade popup */}
                    {showPopup === "Parade" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Parade</h2>
                                <p>De eerst Owee activiteit waar dodeka te vinden is met een beeldschone prachtige en zeker veilige parade kar is de parade, wij zullen ons in een stoet van verenigingen voortbewegen langs de Schie. Zwaaien is toegestaan.</p>
                            </div>
                            <img className="OWeeImagePopup" src={parade} />
                        </div>
                        </>
                    )}
                    {/* Feest popup */}
                    {showPopup === "Feest" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Openingsfeest</h2>
                                <p>Na de parade, is Dodeka natuurlijk ook bij het openingsfeest. Hier kun je al een kleine sneak peak krijgen van hoe leuk Dodeka is, buiten het sporten om </p>
                            </div>
                            <img className="OWeeImagePopup" src={trackFestival} />
                        </div>
                        </>
                    )}
                    {/* Infomarkt popup */}
                    {showPopup === "Infomarkt" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Infomarkt</h2>
                                <p>Op maandag wordt de markt van Delft omgetoverd tot een verenigings informatie walhalla. Met een in dodeka stijl opgemaakte kraam zijn wij hier te vinden. Onze leden zijn aanwezig om je alles te vertellen over onze prACHTige vereniging. Kom langs, stel al je vragen, doe mee aan een reactie spelletje of een prijsvraag en geniet van deze eerste dag van de OWee</p>
                            </div>
                            <img className="OWeeImagePopup" src={infomarkt} />
                        </div>
                        </>
                    )}
                    {/* Training popup */}
                    {showPopup === "Training" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Training</h2>
                                <p>De maandag en woensdag kan worden afgesloten met een sportieve training bij ons op de atletiekbaan, op het adres Sportring 12. Proeftrainen kan 3 keer gratis en zelfs tijdens de OWee! </p>
                                <p>Meld je hier aan voor een <a href="https://dsavdodeka.nl/trainingen/">proeftraining</a></p>
                            </div>
                            <img className="OWeeImagePopup" src={training_rennen} />
                        </div>
                        </>
                    )}
                    {/* Runclub popup */}
                    {showPopup === "Runclub" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Runclub</h2>
                                <p>Voor de OWee loper die een Owee renner wil worden hebben we dit jaar een primeur: Dodeka Runclub! Op dinsdagochtend zullen we om 10:30 verzamelen op de markt. Vanaf hier wordt, samen met leden van Dodeka op een rustig tempo een rondje van 5km gelopen door Delft. Krijg alvast een beeld van de stad, leer wat dodekaëders kennen en geniet van een ontspannen sportieve sfeer.</p>
                                <br></br>
                                <p>Onderweg zal er gestopt worden bij kaaslokaal Delft om te genieten van een gratis blokje kaas. Na deze korte pauze gaat de run verder, we eindigen bij Piada at the canal, waar deelnemers die het tot het einde hebben gehaald beloond worden met een gratis Piade. </p>
                                <br></br>
                                <p>Ook zonder sportkleding of de hipste hardloopschoenen ben je welkom om deel te nemen. Inschrijven kan via deze <a href = "https://docs.google.com/forms/d/1LPveictqRrqoOw4EwtREOpF4oxneMskBCbn8fzhwjEw/edit">link </a></p>                                
                            </div>
                            <img className="OWeeImagePopup" src={run} />
                        </div>
                        </>
                    )}
                    {/* Sportfeest popup */}
                    {showPopup === "Sportfeest" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Sportfeest bij Proteus</h2>
                                <p>Dodeka is natuurlijk niet te missen bij het sportfeest op proteus. Hier kun je zien dat dodeka niet alleen een sportvereniging is maar ook super gezellig.</p>
                            </div>
                            <img className="OWeeImagePopup" src={sportfeest} />
                        </div>
                        </>
                    )}
                    {/* Activiteiten markt popup */}
                    {showPopup === "Act_markt" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Activiteitenmarkt bij X</h2>
                                <p>Altijd al eens willen kogelstoten? Of laten zien dat jij de snelste sprinter bent? Tijdens de activiteitenmarkt kan je laagdrempelig deelnemen aan deze onderdelen, ondertussen spreken met dodeka leden en genieten van deze laatste dag van de OWee. </p>
                            </div>
                            <img className="OWeeImagePopup" src={activiteitenmarkt
                            } />
                        </div>
                        </>
                    )}
                    {/* Chilldag popup */}
                    {showPopup === "Chilldag" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Delftse hout relax dag</h2>
                                <p>Als afsluiter van de Owee wordt er vanaf 11:30 met dodeka ontspannen in het Delftse hout.</p>
                            </div>
                            <img className="OWeeImagePopup" src={Chillen_op_gras}/>
                        </div>
                        </>
                    )}
                    {/* Borrel popup */}
                    {showPopup === "Borrel" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Borrel</h2>
                                <p>Borrel mee na de training op een van onze super gezellige borrels in de kantine.</p>
                                <br></br>
                                <p>Vergeet niet wat eten mee te nemen (anders is de mac om de hoek😉)</p>
                            </div>
                            <img className="OWeeImagePopup" src={borrel} />
                        </div>
                        </>
                    )}
                </div>
                
            )}
            
        </div>
    )
}

export default OWeeSchema;