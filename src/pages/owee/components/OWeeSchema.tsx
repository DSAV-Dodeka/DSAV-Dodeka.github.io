import "./OWeeSchema.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import parade from "$images/owee/parade.webp";
import activiteitenmarkt from "$images/owee/activiteitenmarkt.webp";
import borrel from "$images/owee/borrel.webp";
import Chillen_op_gras from "$images/owee/Chillen_op_gras.webp";
import infomarkt from "$images/owee/infomarkt.jpeg";
import sportfeest from "$images/owee/sportfeest.webp";
import trackFestival from "$images/owee/track_festival.webp";
import training_rennen from "$images/owee/training_rennen.webp";
import run from "$images/owee/run.webp";

/*
 * DE OWEE-PLANNING AANPASSEN (bijv. voor volgend jaar)
 * ====================================================
 *
 * Elke activiteit staat op TWEE plekken in dit bestand:
 *
 *   1. Het kaartje in de planning        -> hieronder, binnen een <div className="OWeeDag">
 *   2. De popup met de uitleg + foto     -> verderop, onder "POPUPS"
 *
 * Die twee horen bij elkaar via een sleutelwoord. Op het kaartje staat
 * setShowPopup("Borrel") en bij de popup showPopup === "Borrel". Zolang die
 * twee exact hetzelfde zijn (hoofdletters tellen mee!) opent het juiste
 * verhaal. Typ je ze verschillend, dan gebeurt er bij het klikken niets.
 *
 * Alleen tijden, plaatsen of teksten wijzigen?
 *   Dat is gewoon tekst: pas de regels in het kaartje of in de popup aan.
 *   Er is geen aparte lijst of database, alles staat letterlijk hier.
 *
 * Een activiteit TOEVOEGEN:
 *   1. Kopieer een bestaand <div className="OWeeActiviteit"> ... </div> blok
 *      naar de dag waar het bij hoort en pas de tekst aan.
 *   2. Verzin een nieuw sleutelwoord, bijv. setShowPopup("Pubquiz").
 *   3. Kopieer onder "POPUPS" een bestaand blok en zet daar showPopup === "Pubquiz".
 *   4. Foto: zet het bestand in src/images/owee/ en voeg bovenaan een import
 *      toe (kijk naar de regels hierboven), gebruik hem dan in <img src={...} />.
 *
 * Een activiteit WEGHALEN: verwijder allebei de blokken (kaartje + popup).
 *
 * Een DAG toevoegen of weghalen: kopieer/verwijder een heel
 * <div className="OWeeDag"> ... </div> blok. De kolommen verdelen zichzelf,
 * je hoeft niets aan de opmaak te veranderen.
 *
 * Let op: "Training" staat twee keer in de planning (maandag en woensdag) en
 * gebruikt beide keren dezelfde sleutel, dus samen één popup. Moet er voor één
 * van de twee iets anders in de popup staan, geef die dan een eigen sleutel.
 *
 * Een INSCHRIJFKNOP in een popup (zoals bij Training en Runclub): kopieer het
 * blok met className="OWeeInschrijfKnop". Verwijst hij naar een pagina op onze
 * eigen site, gebruik dan <Link to="/trainingen">; gaat hij naar buiten (een
 * Google Formulier bijvoorbeeld), gebruik dan <a href="..." target="_blank">.
 *
 * Let op bij Google Formulieren: gebruik de deel-link uit de knop "Verzenden"
 * (die ziet eruit als .../forms/d/e/LANGE-CODE/viewform). De link uit de
 * adresbalk terwijl je het formulier zelf aan het bewerken bent eindigt op
 * /edit en stuurt bezoekers naar een "toegang aanvragen"-scherm.
 *
 * Kleuren, afstanden en de vormgeving staan in OWeeSchema.scss.
 * De knop naar het interesseformulier onder de planning is een los bestand:
 * OWeeInteresse.tsx.
 */

// Alle foto's die alleen in een popup staan. Ze worden meteen bij het openen van
// de pagina opgehaald, zodat de foto er al staat als je op een activiteit klikt.
// Voeg een nieuwe popup-foto hier ook toe.
const popupImages = [
    parade,
    activiteitenmarkt,
    borrel,
    Chillen_op_gras,
    infomarkt,
    sportfeest,
    trackFestival,
    training_rennen,
    run,
];

function OWeeSchema() {
    const [showPopup, setShowPopup] = useState<string | null>(null);

    // Haal de popup-foto's alvast op, zodat een popup meteen compleet is.
    useEffect(() => {
        for (const src of popupImages) {
            const img = new Image();
            img.src = src;
        }
    }, []);

    // Sluit de popup met Escape, en bevries de pagina eronder zolang hij open staat.
    useEffect(() => {
        if (showPopup === null) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowPopup(null);
        };
        document.addEventListener("keydown", onKeyDown);

        const vorigeOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = vorigeOverflow;
        };
    }, [showPopup]);

    return(
        <div className="OWeeSchema">
            <h1 className="OWeeHeader">OWEE PLANNING D.S.A.V DODEKA</h1>
            <div className="planning">
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Zondag</h1>
                    <h1 className="OWeeDatum">16 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Parade")}>
                        <h1 className="OWeeActiviteitNaam">Parade</h1>
                        <p className="OWeeActiviteitTijd">16:45-19:00</p>
                        <p className="OWeeActiviteitPlaats">Langs de Schie</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                    { <div className="OWeeActiviteit" onClick={() => setShowPopup("Feest")}>
                        <h1 className="OWeeActiviteitNaam">Openingsfeest</h1>
                        <p className="OWeeActiviteitTijd">20:00-01:00</p>
                        <p className="OWeeActiviteitPlaats">Tu Delft Aula</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>}
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Maandag</h1>
                    <h1 className="OWeeDatum">17 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Infomarkt")}>
                        <h1 className="OWeeActiviteitNaam">Infomarkt</h1>
                        <p className="OWeeActiviteitTijd">13:00-17:45</p>
                        <p className="OWeeActiviteitPlaats">Grote Markt</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Training")}>
                        <h1 className="OWeeActiviteitNaam">Training</h1>
                        <p className="OWeeActiviteitTijd">18:15-19:45</p>
                        <p className="OWeeActiviteitPlaats">Sportring 12</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Dinsdag</h1>
                    <h1 className="OWeeDatum">18 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Runclub")}>
                        <h1 className="OWeeActiviteitNaam">Runclub</h1>
                        <p className="OWeeActiviteitTijd">10:30-11:30</p>
                        <p className="OWeeActiviteitPlaats">Grote Markt</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Sportfeest")}>
                        <h1 className="OWeeActiviteitNaam">Sportfeest <span className="OWeeActiviteitNaamVenue">@ Proteus</span></h1>
                        <p className="OWeeActiviteitTijd">20:30-03:00</p>
                        <p className="OWeeActiviteitPlaats">Rotterdamseweg 362a</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Woensdag</h1>
                    <h1 className="OWeeDatum">19 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Act_markt")}>
                        <h1 className="OWeeActiviteitNaam">Activiteitenmarkt </h1>
                        <p className="OWeeActiviteitTijd">11:00-15:00</p>
                        <p className="OWeeActiviteitPlaats">Op X</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Training")}>
                        <h1 className="OWeeActiviteitNaam">Training</h1>
                        <p className="OWeeActiviteitTijd">18:15-19:45</p>
                        <p className="OWeeActiviteitPlaats">Sportring 12</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Borrel")}>
                        <h1 className="OWeeActiviteitNaam">Borrel</h1>
                        <p className="OWeeActiviteitTijd">20:00-23:00</p>
                        <p className="OWeeActiviteitPlaats">Delftse Hout</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                </div>
                <div className="OWeeDag">
                    <h1 className="OWeeDatumDag">Donderdag</h1>
                    <h1 className="OWeeDatum">20 augustus</h1>
                    <div className="OWeeActiviteit" onClick={() => setShowPopup("Chilldag")}>
                        <h1 className="OWeeActiviteitNaam">Delftse Hout relax</h1>
                        <p className="OWeeActiviteitTijd">11:30-13:00</p>
                        <p className="OWeeActiviteitPlaats">Delftse Hout</p>
                        <span className="OWeeActiviteitInfo">Klik voor meer info</span>
                    </div>
                </div>
            </div>
            {/* ======================= POPUPS =======================
                Hieronder staat per activiteit het verhaal dat verschijnt als je
                op het kaartje klikt. Er zijn twee lagen:
                  .popupOverlay = de donkere laag over de hele pagina; klik je
                                  daarop (dus naast de popup), dan sluit hij.
                  .popup        = het witte kaartje zelf; een klik hierbinnen
                                  sluit juist niet (dat doet stopPropagation).
                Sluiten kan ook met het kruisje of met de Escape-toets. */}
            {showPopup !== null && (
                <div className="popupOverlay" onClick={() => setShowPopup(null)}>
                <div
                    className="popup"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                >
<button className="closePopup" onClick={() => setShowPopup(null)} aria-label="Sluiten">
                    ×
                </button>

                    {/* Parade popup */}
                    {showPopup === "Parade" && (
                        <>
                        <div className="popupContent">
                            <div className="popupText">
                                <h2>Parade</h2>
                                <p>De eerste OWee-activiteit waar Dodeka te vinden is met een beeldschone prachtige en zeker veilige paradekar is de parade, wij zullen ons in een stoet van verenigingen voortbewegen langs de Schie. Zwaaien is toegestaan.</p>
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
                                <p>Na de parade is Dodeka natuurlijk ook bij het openingsfeest. Hier kun je al een kleine sneak peek krijgen van hoe leuk Dodeka is, buiten het sporten om.</p>
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
                                <p>Op maandag wordt de markt van Delft omgetoverd tot een walhalla van verenigingsinformatie. Met een in Dodeka-stijl opgemaakte kraam zijn wij hier te vinden. Onze leden zijn aanwezig om je alles te vertellen over onze prachtige vereniging. Kom langs, stel al je vragen, doe mee aan een reactiespelletje of een prijsvraag en geniet van deze eerste dag van de OWee.</p>
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
                                <p>De maandag en woensdag kunnen worden afgesloten met een sportieve training bij ons op de atletiekbaan, op het adres Sportring 12. Proeftrainen kan 3 keer gratis en zelfs tijdens de OWee! </p>
                                {/* Verwijst naar onze eigen trainingenpagina; daar staat alles
                                    over de trainingen en het proeftrainen. <Link> in plaats van
                                    <a> houdt het binnen de site (geen herlaadbeurt). */}
                                <Link className="OWeeInschrijfKnop" to="/trainingen">
                                    Meld je aan voor een proeftraining
                                    <svg className="OWeeInschrijfKnopPijl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                                    </svg>
                                </Link>
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
                                <p>Voor de OWee-loper die een OWee-renner wil worden hebben we dit jaar een primeur: Dodeka Runclub! Op dinsdagochtend zullen we om 10:30 verzamelen op de markt. Vanaf hier wordt, samen met leden van Dodeka op een rustig tempo een rondje van 5 km gelopen door Delft. Krijg alvast een beeld van de stad, leer wat dodekaëders kennen en geniet van een ontspannen sportieve sfeer.</p>
                                <br></br>
                                <p>Onderweg zal er gestopt worden bij kaaslokaal Delft om te genieten van een gratis blokje kaas. Na deze korte pauze gaat de run verder, we eindigen bij Piada at the canal, waar deelnemers die het tot het einde hebben gehaald beloond worden met een gratis Piade. </p>
                                <br></br>
                                <p>Ook zonder sportkleding of de hipste hardloopschoenen ben je welkom om deel te nemen.</p>
                                <a className="OWeeInschrijfKnop" href="https://docs.google.com/forms/d/e/1FAIpQLScaKjcdk330TxKcTaVkdwLJXSA7JScnKfdfgMYHLzJyGQ4EKw/viewform" target="_blank" rel="noreferrer">
                                    Schrijf je in voor de Runclub
                                    <svg className="OWeeInschrijfKnopPijl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                                    </svg>
                                </a>
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
                                <p>Dodeka is natuurlijk niet te missen bij het sportfeest op Proteus. Hier kun je zien dat Dodeka niet alleen een sportvereniging is maar ook super gezellig.</p>
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
                                <p>Altijd al eens willen kogelstoten? Of laten zien dat jij de snelste sprinter bent? Tijdens de activiteitenmarkt kan je laagdrempelig deelnemen aan deze onderdelen, ondertussen spreken met Dodeka-leden en genieten van deze laatste dag van de OWee. </p>
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
                                <p>Als afsluiter van de OWee wordt er vanaf 11:30 met Dodeka ontspannen in het Delftse Hout.</p>
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
                </div>{/* einde .popup (het witte kaartje) */}
                </div>
            )}
            
        </div>
    )
}

export default OWeeSchema;