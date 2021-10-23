import React from "react";
import Header from "../../../components/Header";
import {ReactComponent as Maltha} from "../../../images/contact/maltha.svg";

function Sponsoropties() {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-16 lg:mb-24">
            
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-2/3">
            <Header text="Sponsor ons!" position="left"/>
                <p class="text-white text-md mx-4 lg:mx-16 mt-4 lg:mt-8 mb-16 lg:mb-24">
                D.S.A.V. Dodeka staat altijd open voor nieuwe sponsorsamenwerkingen zodat we atletiek voor nog meer Delftse studenten mogelijk en leuker kunnen maken. We bieden veel mogelijkheden om uw organisatie met meer studenten binnen en buiten Delft in contact te brengen. De opties variëren van advertenties in het jaarboek of op instagram tot logo’s op het shirt of website. Indien u geïnteresseerd bent in sponsoren kunt u voor meer informatie mailen naar  <a target="_blank" rel="noreferrer" class="text-rood" href="mailto:studentenatletiek@av40.nl">studentenatletiek@av40.nl</a>.
               </p>
                <Header text="Huidige sponsors" position="left"/>
                <div class="pt-4 px-4 text-white lg:text-center">
                    <a target="_blank" rel="noreferrer" href="https://www.malthasport.nl/"><Maltha fill="white" class="lg:mx-12 w-36 h-32"/></a>
                </div>
               
            </div>
            <img src={require(`../../../images/sponsors/sponsoropties.jpg`).default} alt="" class="lg:inline w-full lg:w-1/3 pt-16 lg:pt-0 lg:pl-16 bg-white" />
        </div>
    )
}
export default Sponsoropties;
