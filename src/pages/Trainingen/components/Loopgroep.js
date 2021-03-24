import React from "react";
import Header from "../../../components/Header";
import image from "../../../images/baanatletiek.jpg"

function Loopgroep() {
    return(
        <div class="flex bg-blauw bg-opacity-90 w-full mb-16">
            <img src={image} alt="" class="inline w-1/2" />
            <div class="inline my-8 w-1/2">
                <Header text="Loopgroep" position="right"/>
                <p class="text-white text-lg mx-16 mt-8">
                    De loopgroep trainingen worden gegeven door Rik Palings en Aniek Sips. 
                    Er wordt getraind voor de langere afstanden op de baan en op de weg.
                    Op maandag traint deze groep na de warming-up buiten de baan op de weg. Op woensdag blijven we op de baan om daar loopschema's te trainen. En op zaterdag wordt er afwisselend op de baan en buiten de baan getraind.<br/><br/>
                    De trainingen worden altijd aangepast voor verschillende niveaus, zodat iedereen mee kan met de trainingen. Ook zit er veel variatie in de trainingen. Zo trainen we korte en lange intervallen, doen we heuveltrainingen en duurloopjes, en trainen we op verschillende ondergronden. Dit zorgt ervoor dat je zowel je snelheid als je uithoudingsvermogen zal verbeteren.     
                </p>
            </div>    
        </div>
    )
}
export default Loopgroep;