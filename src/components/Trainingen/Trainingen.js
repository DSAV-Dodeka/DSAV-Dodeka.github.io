import React from "react";
import PageTitle from "../Shared/PageTitle";
import Tijden from "./Tijden";
import Placeholder from "../../images/placeholder.png";
import icons from "../../images/icons.PNG";
import "./Icons.css";

function Trainingen() {
    return (
        <div>
            <PageTitle title="Trainingen" />
            <Tijden />
            <div class="flex bg-blauw bg-opacity-90 w-full mb-16">
                <div class="inline my-8 mx-16 w-1/2">
                    <h class="text-white text-lg">
                        Dit moet nog even uitgebreid geschreven worden. <br /> <br />
                        Proeftrainen kan altijd. <br /> <br />
                        Trainingstijden staan hierboven. <br /> <br />
                        Twee verschillende groepen. <br /> <br />
                        Meld je aan voor een proeftraining. <br /> <br />
                        Via insta of mail. <br /> <br />
                    </h>
                </div>
                <div class="inline w-1/2 mx-16">
                    <iframe class="w-full h-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454.7636217944923!2d4.365595816481968!3d52.029403779724376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b60b0c9dbfa9%3A0x9fa03ef4a72f1db8!2sDelftse%20Atletiekvereniging%201940!5e0!3m2!1snl!2snl!4v1616071415753!5m2!1snl!2snl" loading="lazy"></iframe>
                </div>
            </div>
            <div class="flex bg-blauw bg-opacity-90 w-full mt-24">
                <div class="inline my-8 w-1/2">
                    <div class="w-full py-2 bg-rood font-rajdhani">
                        <h1 class={"mx-16 text-3xl text-white font-bold "}>
                            BAANATLETIEK
                        </h1>
                    </div>
                    <p class="text-white text-lg mx-16 mt-8">
                        Dit moet nog even uitgebreid geschreven worden. <br /> <br />
                        Proeftrainen kan altijd. <br /> <br />
                        Trainingstijden staan hierboven. <br /> <br />
                        Twee verschillende groepen. <br /> <br />
                        Meld je aan voor een proeftraining. <br /> <br />
                        Via insta of mail. <br /> <br />
                    </p>
                </div>
                <div class="inline w-1/2">
                    <img src={Placeholder} alt="" class="w-full object-scale-down">
                    </img>
                </div>
            </div>
            <div id="icons" class="h-24 w-full" style={{backgroundImage: `url(${icons})`}}/>
            <div class="flex bg-blauw bg-opacity-90 w-full mb-16">
                <div class="inline w-1/2">
                    <img src={Placeholder} alt="" class="w-full h-full">
                    </img>
                </div>
                <div class="inline my-8 w-1/2">
                <div class="w-full py-2 bg-rood font-rajdhani">
                        <h1 class={"mx-16 text-3xl text-white font-bold text-right"}>
                            LOOPGROEP
                        </h1>
                    </div>
                    <p class="text-white text-lg mx-16 mt-8">
                        Dit moet nog even uitgebreid geschreven worden. <br /> <br />
                        Proeftrainen kan altijd. <br /> <br />
                        Trainingstijden staan hierboven. <br /> <br />
                        Twee verschillende groepen. <br /> <br />
                        Meld je aan voor een proeftraining. <br /> <br />
                        Via insta of mail. <br /> <br />
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Trainingen;