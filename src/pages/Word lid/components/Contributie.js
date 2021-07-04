import React from "react";
import Header from "../../../components/Header";

function Contributie(props) {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-16 lg:mb-24">
            <img src={require(`../../../images/word_lid/${props.foto}`).default} alt="" class="lg:inline w-full lg:w-1/2" />
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Contributie" position="right"/>
                <p class="text-white text-md mx-4 lg:mx-16 mt-4 lg:mt-8">
                Naast dat wij trainen op hun atletiekbaan, is D.S.A.V. Dodeka ook een ondervereniging van AV`40. De inschrijvingen en contributie worden daarom via hen geregeld.
                <br/><br/>Als student vallen wij onder de baanatleten, en is de contributie daarmee 52 euro per kwartaal. Om mee te mogen doen met de Nederlandse Studenten Kampioenschappen hoef je niet in het bezit te zijn van een wedstrijdlicentie, maar om mee te kunnen doen aan andere wedstrijden (zoals de competitie) wel. Ben je al wedstrijdlid bij een andere atletiekvereniging? Dan kan je ervoor kiezen om je wedstrijdlicentie om te zetten naar AV`40, of om gastlid bij ons te worden.
                <br/><br/>Vergeet bij het inschrijven niet aan te vinken dat je student bent, want studentenleden krijgen jaarlijks 10 euro korting op de contributie! Als je dit niet aanvinkt worden de prijzen duurder dan in de prijzentabel. 
                <br/><br/>Weet je het nu helemaal zeker? Je vindt <a class="text-rood" target="_blank" rel="noreferrer" href="https://www.av40.nl/index.php?page=Inschrijfformulier&sid=1"><b>hier</b></a> het inschrijfformulier.
                </p>
            </div>
        </div>
    )
}
export default Contributie;
