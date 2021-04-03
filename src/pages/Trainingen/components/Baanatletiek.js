import React from "react";
import Header from "../../../components/Header";
import image from "../../../images/baanatletiek.jpg"

function Baanatletiek() {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full">
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Baanatletiek" position="left"/>
                <p class="text-white text-lg mx-4 lg:mx-16 mt-4 lg:mt-8">
                    De baanatletiek trainingen worden gegeven door Jasper Rou, Koen Stapel, Sanne van Beek en Niels Verheugd. 
                    Tijdens deze trainingen komen alle aspecten van baanatletiek aan bod. Er wordt getraind op kracht, stabiliteit, uithoudingsvermogen en techniek.<br/><br/>
                    Er wordt training gegeven voor alle onderdelen, zowel technisch als de korte en middellange afstanden. Elke training is er na de warming-up keuze uit verschillende werp-, spring- of looponderdelen. 
                    De trainers hebben allemaal hun eigen specialiteiten waardoor ze jou samen naar een hoger niveau kunnen brengen.
                </p>
            </div>
            <img src={image} alt="" class="lg:inline w-full lg:w-1/2" />
        </div>
    )
}
export default Baanatletiek;