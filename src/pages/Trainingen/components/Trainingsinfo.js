import React from "react";
import Maps from "../../../components/Maps";

function Trainingsinfo() {
    return(
        <div class="flex bg-blauw bg-opacity-90 w-full mb-16">
            <div class="inline my-8 mx-16 w-1/2">
                <p class= "text-white text-lg ">
                    De trainingen vinden plaats op maandag van 18:00 tot 19:30, woensdag 18:15 tot 19:45 en zaterdag van 10:45 tot 12:15 op de atletiekbaan van AV`40 in Delft.
                    Alle onderdelen van de atletiek, van de loopnummers tot polsstokhoogspringen, kunnen bij ons getraind worden. Ook zijn de trainingen geschikt voor elk niveau. Er trainen bij ons mensen die net begonnen zijn met atletiek, maar ook mensen die voor de NK's trainen.<br/><br/>
                    We trainen in twee groepen, een baanatletiekgroep voor alle baanonderdelen, en de loopgroep voor de langere loopnummers op de baan en op de weg.
                    Je kan elke training weer kiezen bij welke groep je aansluit, en de warming-up is gezamenlijk met beide groepen.
                    <br/><br/>
                    Lijkt het je leuk om een keer mee te trainen? Geef je dan op via de mail of via een insta-dm.
                </p>
            </div>
            <div class="inline w-1/2 mx-16">
                <Maps />    
            </div>
        </div>
    )
}
export default Trainingsinfo;