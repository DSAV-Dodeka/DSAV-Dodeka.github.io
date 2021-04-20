import React from "react";
import Header from "../../../components/Header";

function Contributie() {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-8 lg:mb-16">
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-full">
                <Header text="Contributie" position="right"/>
                <p class="text-white text-lg mx-4 lg:mx-16 mt-4 lg:mt-8">
                    Wij trainen op de atletiek baan van Atletiek Vereniging 1940. Daar zijn wij een ondervereniging van, dus daar zal dan ook de contributie naartoe gaan. <br></br><br></br>
                    Als student vallen wij onder de baanatleten, en is de contributie daarmee: 53 euro per kwartaal.
                    Om mee te mogen doen met de Nederlandse Studenten Kampioenschappen hoef je niet in het bezit te zijn van een wedstrijdlicentie,
                    maar om mee te kunnen doen aan andere wedstrijden (zoals de competitie) wel.
                    <br></br>Studentleden krijgen een korting van 10 euro per jaar op de contributie (dus 2,50 per kwartaal).
                    Weet je het nu helemaal zeker? Je vind <a href="https://www.google.com/search?q=how+to+underline+text+in+javascript&rlz=1C1CHBD_enNL916NL916&oq=how+to+underline+text+in+javasc&aqs=chrome.0.0j69i57j0i22i30.4716j0j15&sourceid=chrome&ie=UTF-8">hier</a> het inschrijfformulier.<br></br>
                </p>
            </div>
        </div>
    )
}
export default Contributie;
