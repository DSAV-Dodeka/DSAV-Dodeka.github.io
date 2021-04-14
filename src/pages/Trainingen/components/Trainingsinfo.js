import React from "react";
import Maps from "../../../components/Maps";
import ContactButtons from "../../../components/ContactButtons";

function Trainingsinfo() {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-8 lg:mb-16">
            <div class="lg:inline py-8 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <p class= "text-white text-lg px-4 lg:px-0 lg:mx-16 ">
                    De trainingen vinden plaats op maandag van 18:00 tot 19:30, woensdag 18:15 tot 19:45 en zaterdag van 10:45 tot 12:15 op de atletiekbaan van AV`40 in Delft.
                    Alle atletiekonderdelen, van sprint tot de marathon en van speerwerpen tot polsstokhoogspringen, kunnen bij ons getraind worden. Ook zijn de trainingen geschikt voor elk niveau. Er trainen bij ons mensen die net begonnen zijn met atletiek, maar ook mensen die voor de NK's trainen.<br/><br/>
                    We trainen in twee groepen, een baanatletiekgroep voor alle baanonderdelen, en de loopgroep voor de langere loopnummers op de baan en op de weg.
                    Je kan elke training weer kiezen bij welke groep je aansluit, en de warming-up is gezamenlijk met beide groepen.
                    <br/><br/>
                    Lijkt het je leuk om een keer mee te trainen? Geef je dan op via de mail of via een insta-dm.
                </p>
                <ContactButtons />
            </div>
            <div class="lg:inline w-full lg:w-1/2 h-96 lg:h-auto lg:mx-16">
                <Maps />    
            </div>
        </div>
    )
}
export default Trainingsinfo;