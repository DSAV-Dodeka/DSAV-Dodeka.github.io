import React from "react";
import {
    HashLink as Link
  } from "react-router-hash-link";
import "./ContactBar.scss";
  
import Heading from "./Heading";
import {ReactComponent as Maltha} from "../../images/contact/maltha.svg";

function ContactBar() {
    return (
        <div id="contact_bar">
            <div class="bar_container">
                <Link class="no_underline" to="/contact"><Heading title="Contactinformatie" /></Link>
                <div class="bar_info">
                    <p>Email: <a href="mailto:bestuur@dsavdodeka.nl" class="bar_link">bestuur@dsavdodeka.nl</a></p>
                    <p>Adres: <a target="_blank" rel="noreferrer" href="https://www.google.nl/maps/place/Delftse+Atletiekvereniging+1940/@52.0294071,4.3655958,17z/data=!3m1!4b1!4m5!3m4!1s0x47c5b60b0c9dbfa9:0x9fa03ef4a72f1db8!8m2!3d52.0294038!4d4.3677845" class="bar_link">Sportring 12, Delft</a></p>
                    <Link to="/contact" class="bar_link">F.A.Q.</Link>
                </div>
            </div>
            <div class="bar_container">
                <Link class="no_underline" to="/trainingen#"><Heading title="Trainingsdagen" /></Link>
                <div class="bar_info">
                    <p>Maandag 18:00 - 19:30</p>
                    <p>Woensdag 18:15 - 19:45</p>
                    <p>Zaterdag 10:15 - 11:45</p>
                    <br/>
                    <p>D.S.A.V. Dodeka is een ondervereniging van <a target="_blank" rel="noreferrer" href="https://www.av40.nl" class="bar_link">AV`40</a></p>
                </div>
            </div>
            <div class="bar_container">
                <Link class="no_underline" to="/contact/sponsors#"><Heading title="Sponsors" /></ Link>
                <div class="bar_info">
                    <a target="_blank" rel="noreferrer" href="https://www.malthasport.nl/"><Maltha id="maltha" fill="white"/></a>
                    
                </div>
                
            </div>
        </div>
    )
}

export default ContactBar;