import React from "react";
import Header from "../../../components/Header";
import {ReactComponent as Maltha} from "../../../images/contact/maltha.svg";
import "./Sponsoropties.scss"

function Sponsoropties() {
    return(
        <div class="sponsoropties_1">
            
            <div class="sponsoropties_2">
            <Header text="Sponsor ons!" position="left"/>
                <p class="sponsoropties_3">
                D.S.A.V. Dodeka staat altijd open voor nieuwe sponsorsamenwerkingen zodat we atletiek voor nog meer Delftse studenten mogelijk en leuker kunnen maken. We bieden veel mogelijkheden om uw organisatie met meer studenten binnen en buiten Delft in contact te brengen. De opties variëren van advertenties in het jaarboek of op instagram tot logo’s op het shirt of website. Indien u geïnteresseerd bent in sponsoren kunt u voor meer informatie mailen naar  <a target="_blank" rel="noreferrer" class="linktomail_1" href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>.
               </p>
                <Header text="Huidige sponsors" position="left"/>
                <div class="sponsoropties_4">
                    <a target="_blank" rel="noreferrer" href="https://www.malthasport.nl/"><Maltha fill="white" class="sponsoropties_5"/></a>
                </div>
               
            </div>
            <img src={require(`../../../images/sponsors/sponsoropties.jpg`).default} alt="" class="sponsoropties_6" />
        </div>
    )
}
export default Sponsoropties;
