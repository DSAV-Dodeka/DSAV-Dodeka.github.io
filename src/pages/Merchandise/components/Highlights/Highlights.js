import React from "react";
import Title from "./Title";
import Gallery from "./Gallery";

function Highlights(props) {
    return(
        <div class="lg:flex pt-8 pb-8 mb-16 lg:mb-24 bg-blauw bg-opacity-90">
            <p class="w-full lg:w-1/2 text-white px-4 pb-4 lg:px-0 lg:pb-0 lg:mx-16">
                Wil je als (nieuw) lid meteen de laatste D.S.A.V. Dodeka fashiontrends volgen? Bestel dan (https://forms.gle/f3RyZiA7Do4oUY696) je D.S.A.V. Dodeka merch! Op dit moment zijn de volgende kledingstukken te bestellen: T-shirt, wind-jack, singlet, hoodie en een joggingbroek. Zie hieronder de foto's voor voorbeelden.

                <br></br><br></br>
                Nu denk je vast, het lijkt wel heel erg op de oude merch, dat klopt, de nieuwe merch is in aantocht, maar de .ComCom wacht eventjes met het kiezen van de juiste foto's tot er een leuke photoshoot is gedaan met de nieuwe merch. <br></br><br></br>

                Vanwege onze samenwerking met Maltha Sport krijg je daar bij al je aankopen 10% korting!</p>

            <div class="w-full lg:w-1/2">
            <Title title="Highlights"/>
            <Gallery items={props.items}/>
            </div>
            
        </div>   
    )
}

export default Highlights;

