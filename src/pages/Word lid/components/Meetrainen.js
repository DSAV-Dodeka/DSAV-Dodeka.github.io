import React from "react";
import {
    HashLink as Link
} from "react-router-hash-link";
import Header from "../../../components/Header";
import ContactButtons from "../../../components/ContactButtons";

function Meetrainen(props) {
    return (
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-16 lg:mb-24">
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Proeftrainen" position="left" />
                <p class="text-white text-md mx-4 lg:mx-16 mt-4 lg:mt-8">
                  Bij D.S.A.V. Dodeka krijg je het hele jaar door de mogelijkheid om drie keer gratis te komen proeftrainen. Zo kun je de sfeer te proeven en erachter komen of atletiek iets voor jou is. Heb je na de proeftrainingen de smaak te pakken en wil je lid worden? Inschrijvingen verlopen via AV`40 en hun inschrijfformulier vind je hieronder.
                </p>
                <a target="_blank" rel="noreferrer" href="https://www.av40.nl/index.php?page=Inschrijfformulier&sid=1" class="block relative lg:flex-1 lg:w-auto  bg-rood py-4 text-white text-lg text-center rounded font-bold cursor-pointer mt-4 lg:mt-8 mx-4 lg:mx-16">
                    <p>Schrijf je in!</p>
                </a>
                <p class="text-white text-md mx-4 lg:mx-16 mt-4 lg:mt-8">Mocht je nu nog vragen hebben, kijk dan in onze <Link smooth to="/contact#faq" class="text-rood">F.A.Q</Link>, of stuur een berichtje via de mail of Instagram!</p>
                <ContactButtons />
            </div>
            <img src={require(`../../../images/word_lid/${props.foto}`).default} alt="" class="lg:inline w-full lg:w-1/2 object-cover" />
        </div>
    )
}

export default Meetrainen;
