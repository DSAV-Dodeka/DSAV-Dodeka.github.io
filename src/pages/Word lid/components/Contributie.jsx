import React from "react";
import Header from "../../../components/Header";
import "./Contributie.scss";
import getUrl from "../../../functions/links";

function Contributie(props) {
    return(
        <div className="contributie_1">
            <div className = "jesper_probeert_flex">
                <div className="contributieTabel1">
                    Wedstrijdlid<span className="jaapie"><sup> 1</sup></span> <br/>
                    Recreantlid<span className="jaapie"><sup> 2</sup></span> <br/>
                    Gastlid<span className="jaapie"><sup> 2</sup></span> <br/>
                    Inschrijfgeld <br/>
                </div>
                <div className="vl"></div>
                <div className="contributieTabel2">
                    <span>&#8364;</span>57,95 <span className="jaapie">per kwartaal</span><br/>
                    <span>&#8364;</span>52,90 <span className="jaapie">per kwartaal</span><br/>
                    <span>&#8364;</span>42,75 <span className="jaapie">per kwartaal</span><br/>
                    <span>&#8364;</span>20,00,- <span className="jaapie">eenmalig</span><br/>
                    <span className="footnote_contributie">
                        <div><sup>1</sup>:Inclusief wedstrijdlicentie</div>
                        <div><sup>2</sup>:Exclusief wedstrijdlicentie</div>
                    </span>
                </div>
            </div>
            <div className="contributie_3">
                <Header text="Contributie" position="right"/>
                <p className="contributie_4">
                Naast dat wij trainen op hun atletiekbaan, is Dodeka ook een commissie van AV'40. De inschrijvingen en contributie worden daarom via hen geregeld.
                <br/><br/>
                Als student vallen wij onder de baanatleten en is de contributie daarmee <span>&#8364;</span>57,95 per kwartaal. Om mee te mogen doen met wedstrijden, zoals de competitie of de Nederlandse Studenten Kampioenschappen, moet je in het bezit zijn van een wedstrijdlicentie. Ben je al wedstrijdlid bij een andere atletiekvereniging? Dan kan je ervoor kiezen om je wedstrijdlicentie om te zetten naar AV'40, of om gastlid bij ons te worden.
                <br/><br/>
                Vergeet bij het inschrijven niet aan te vinken dat je student bent, want studentenleden krijgen jaarlijks <span>&#8364;</span>10 korting op de contributie! Als je dit niet aanvinkt worden de prijzen hoger dan in de prijzentabel hiernaast.
                </p>
            </div>
        </div>
    )
}
export default Contributie;