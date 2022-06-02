import React from "react";
import parse from "html-react-parser";
import "./WedstrijdAlgemeen.scss";
import getUrl from "../../../functions/links";

function Wedstrijd(props) {
    return(
        <div className="wedstrijd_algemeen">
            <img className="wedstrijd_algemeen_foto" alt="" src={getUrl(`wedstrijden/${props.wedstrijd.foto}`)}/>
            <p class="wedstrijd_algemeen_info">{parse(props.wedstrijd.info_lang)}
                {/* Het Nederlandse Studentenkampioenschap Indooratletiek 2022 is dit jaar op zaterdag 12 maart georganiseerd door D.S.A.V. Dodeka in Omnisport, Apeldoorn. Wij vonden het een heel geslaagde dag, en willen graag alle deelnemers, vrijwilligers, officials, sponsors en andere ondersteunende partijen van harte bedanken. Zonder jullie was het nooit mogelijk geweest.<br/><br/>
                De dag begon om 11 uur met de eerste onderdelen en eindigde rond 7 uur na de estafettes en het ludieke onderdeel: slalommen over de hoogteverschillen van de rondbaan. Vervolgens zijn we van locatie verhuisd om gezellig te gaan eten en de dag af te sluiten met een groot feest. <br/><br/>
                Terugblikken op deze dag? Onderstaand is een overzicht van alle (tot nu toe binnengekomen) foto's van de fotografen. Delen mag, graag met het noemen van de naam van de fotograaf.<br/><br/>
                <a target="_blank" rel="noreferrer" href="https://photos.app.goo.gl/UeAXqJz5YnMrsr457" className="wedstrijd_algemeen_link">Harry van 't Veld</a><br/>
                <a target="_blank" rel="noreferrer" href="https://flic.kr/s/aHBqjzFzhT" className="wedstrijd_algemeen_link">Lars van der Valk</a><br/>
                <a target="_blank" rel="noreferrer" href="https://www.facebook.com/103783782064194/posts/gisteren-fotos-mogen-maken-bij-het-nederlands-studenten-kampioenschap-indoor-atl/150978680678037/" className="wedstrijd_algemeen_link">MaLy photography</a><br/>
                <a target="_blank" rel="noreferrer" href="https://www.flickr.com/gp/195286001@N08/Z5L0AA" className="wedstrijd_algemeen_link">Bouwe van Leeuwen</a><br/> */}
            </p>
            {("uitslagen" in props.wedstrijd ? <a target="_blank" rel="noreferrer" href={props.wedstrijd.uitslagen} className="inschrijf_button">Uitslagen</a> : ("inschrijven" in props.wedstrijd ? <a target="_blank" rel="noreferrer" href={props.wedstrijd.inschrijven} className="inschrijf_button">Inschrijven</a> : "" ))}
            
        </div>
    )
}

export default Wedstrijd;