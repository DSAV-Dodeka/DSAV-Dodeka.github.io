import React from "react";
import Header from "../../../components/Header";
import "./Contributie.scss";
import getUrl from "../../../functions/links";

function Contributie(props) {
    return(
        <div className="contributie_1">
            <img src={getUrl(`../images/word_lid/${props.foto}`)} alt="" className="contributie_2" />
            <div className="contributie_3">
                <Header text="Contributie" position="right"/>
                <p className="contributie_4">
                Naast dat wij trainen op hun atletiekbaan, is D.S.A.V. Dodeka ook een ondervereniging van AV`40. De inschrijvingen en contributie worden daarom via hen geregeld.
                <br/><br/>
                Als student vallen wij onder de baanatleten, en is de contributie daarmee 52 euro per kwartaal. Om mee te mogen doen met wedstrijden, zoals de competitie of de Nederlandse Studenten Kampioenschappen, moet je in het bezit zijn van een wedstrijdlicentie. Ben je al wedstrijdlid bij een andere atletiekvereniging? Dan kan je ervoor kiezen om je wedstrijdlicentie om te zetten naar AV`40, of om gastlid bij ons te worden.
                <br/><br/>
                Vergeet bij het inschrijven niet aan te vinken dat je student bent, want studentenleden krijgen jaarlijks 10 euro korting op de contributie! Als je dit niet aanvinkt worden de prijzen duurder dan in de prijzentabel.
                <br/><br/>Weet je het nu helemaal zeker? Je vindt <a className="contributie_5" target="_blank" rel="noreferrer" href="https://www.av40.nl/index.php?page=Inschrijfformulier&sid=1"><b>hier</b></a> het inschrijfformulier.
                </p>
            </div>
        </div>
    )
}
export default Contributie;
