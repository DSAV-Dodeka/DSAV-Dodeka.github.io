import React from "react";
import {
    Link
} from "react-router-dom";
import "./ContactBar.scss";
  
import Heading from "./Heading";
import getUrl from "../../functions/links";

function ContactBar() {
    return (
        <div id="contact_bar">
            <div className="bar_container">
                <Link className="no_underline" to="/contact"><Heading title="Contactinformatie" /></Link>
                <div className="bar_info">
                    <p>Email: <a href="mailto:bestuur@dsavdodeka.nl" className="bar_link">studentenatletiek@av40.nl</a></p>
                    <p>Adres: <a target="_blank" rel="noreferrer" href="https://www.google.nl/maps/place/Delftse+Atletiekvereniging+1940/@52.0294071,4.3655958,17z/data=!3m1!4b1!4m5!3m4!1s0x47c5b60b0c9dbfa9:0x9fa03ef4a72f1db8!8m2!3d52.0294038!4d4.3677845" className="bar_link">Sportring 12, Delft</a></p>
                    <Link to="/contact" className="bar_link">F.A.Q.</Link><br/>
                    <a href="/files/privacyverklaring_dodeka_jan23.pdf" target="_blank" rel="noreferrer" className="privacy_link">Privacyverklaring D.S.A.V. Dodeka</a>
                </div>
            </div>
            <div className="bar_container">
                <Link className="no_underline" to="/trainingen#"><Heading title="Trainingsdagen" /></Link>
                <div className="bar_info">
                    <p>Maandag 18:00 - 19:30</p>
                    <p>Woensdag 18:15 - 19:45</p>
                    <p>Zaterdag 10:15 - 11:45</p>
                    <br/>
                    <p>D.S.A.V. Dodeka is een trainingsgroep voor studenten binnen <a target="_blank" rel="noreferrer" href="https://www.av40.nl" className="bar_link">AV'40</a></p>
                </div>
            </div>
            <div className="bar_container">
                <Link className="no_underline" to="/contact/sponsors#"><Heading title="Sponsors" /></ Link>
                <div className="bar_info">
                    <a target="_blank" rel="noreferrer" href="https://www.malthasport.nl/"><img src={getUrl(`sponsors/maltha.png`)} alt="" className="bar_sponsor maltha_bar"></img></a>
                    <a target="_blank" rel="noreferrer" href="https://kernengineers.nl/"><img src={getUrl(`sponsors/kern.svg`)} alt="" className="bar_sponsor kverneland_bar"></img></a>
                    <a target="_blank" rel="noreferrer" href="https://www.tsagroup.nl/"><img src={getUrl(`sponsors/tsa.png`)} alt="" className="bar_sponsor tsa_bar"></img></a>
                    <a target="_blank" rel="noreferrer" href="https://www.studentendrukwerk.nl/"><img src={getUrl(`sponsors/studentendrukwerk.png`)} alt="" className="bar_sponsor tsa_bar"></img></a>
                </div>
                
            </div>
        </div>
    )
}

export default ContactBar;