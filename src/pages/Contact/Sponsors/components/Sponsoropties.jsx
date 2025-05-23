import React from "react";
import Header from "../../../../components/Header";
import "./Sponsoropties.scss"
import {getNestedImagesUrl} from "../../../../functions/links";

function Sponsoropties() {
    return(
        <div className="sponsoropties_1">
            
            <div className="sponsoropties_2">
            <Header text="Sponsor ons!" position="left"/>
                <p className="sponsoropties_3">
                D.S.A.V. Dodeka staat altijd open voor nieuwe sponsorsamenwerkingen zodat we atletiek voor nog meer Delftse studenten mogelijk en leuker kunnen maken. We bieden veel mogelijkheden om uw organisatie met meer studenten binnen en buiten Delft in contact te brengen. De opties variëren van advertenties in het jaarboek of op instagram tot logo’s op het shirt of website. Indien u geïnteresseerd bent in sponsoren kunt u voor meer informatie mailen naar  <a target="_blank" rel="noreferrer" className="linktomail_1" href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>.
               </p>
                <Header text="Huidige sponsors" position="left"/>
                <div className="sponsoropties_4">
                    <a target="_blank" rel="noreferrer" href="https://www.malthasport.nl/"><img src={getNestedImagesUrl(`sponsors/maltha.png`)} alt="Maltha Sport" className="sponsoropties_5 maltha"></img></a>
                    <a target="_blank" rel="noreferrer" href="https://muconsult.nl/"><img src={getNestedImagesUrl(`sponsors/muconsult.png`)} alt="MuConsult" className="sponsoropties_5 muconsult"></img></a>
                    <a target="_blank" rel="noreferrer" href="https://www.boozed.nl/"><img src={getNestedImagesUrl(`sponsors/boozed.png`)} alt="Boozed" className="sponsoropties_5 boozed"></img></a>
                </div>
               
            </div>
            <img src={getNestedImagesUrl(`sponsors/sponsoropties.jpg`)} alt="" className="sponsoropties_6" />
        </div>
    )
}
export default Sponsoropties;
