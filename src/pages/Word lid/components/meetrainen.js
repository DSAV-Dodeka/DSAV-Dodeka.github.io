import React from "react";
import Header from "../../../components/Header";
import image from "../../../images/bbq.png"

function Meetrainen() {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-8 lg:mb-16">
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Meetrainen" position="left"/>
                <p class="text-white text-lg mx-4 lg:mx-16 mt-4 lg:mt-8">
                    Bij DSAV Dodeka krijg je het hele jaar door de mogelijkheid om 3 keer gratis mee te trainen.
                    Zo kun je de sfeer te proeven en erachter komen of atletiek iets voor jou is.
                    Heb je na de proeftrainingen de smaak te pakken, en wil je lid bij ons worden? Klik dan <a href="https://www.google.com/search?q=how+to+underline+text+in+javascript&rlz=1C1CHBD_enNL916NL916&oq=how+to+underline+text+in+javasc&aqs=chrome.0.0j69i57j0i22i30.4716j0j15&sourceid=chrome&ie=UTF-8">hier</a> <br></br>

                    Mocht je nu nog vragen hebben, kijk dan in onze F.A.Q., of stuur een mailtje naar info@dsavdodeka.nl
                </p>
            </div>
            <img src={image} alt="" class="lg:inline w-1/2 lg:w-1/2"/>
        </div>
    )
}
export default Meetrainen;