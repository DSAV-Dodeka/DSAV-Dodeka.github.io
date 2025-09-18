import React from "react";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import config from "../../../config";
import {
    Link
} from "react-router";
import Header from "../../../components/Header";
import ContactButtons from "../../../components/ContactButtons";
import "./Meetrainen.scss"
import {getNestedImagesUrl} from "../../../functions/links";
import SchrijfIn from "./SchrijfIn";

function Meetrainen(props) {
    return (
        <div className="meetrainen_1">
            <div className="meetrainen_2">
                <Header text="Proeftrainen en inschrijven" position="left" />
                <p className="meetrainen_3">
                  Bij D.S.A.V. Dodeka krijg je het hele jaar door de mogelijkheid om drie keer gratis te komen proeftrainen. Zo kun je de sfeer proeven en erachter komen of atletiek iets voor jou is. Lijkt het je leuk om een keer mee te trainen? Geef je dan op via de mail of via een DM op Instagram. Heb je na de proeftrainingen de smaak te pakken en wil je lid worden? Schrijf je dan in via de onderstaande knop:
                </p>
                {/* <registration-form-entry configuration="4717c5a6-5e49-4d4d-ca49-08dd2f2dfc8c"></registration-form-entry> */}
                <a href={`${config.auth_location}/credentials/register/`}><button className="schrijfInButton" id="submit_button" type="submit">Inschrijven</button></a>
                {/*<a target="_blank" rel="noreferrer" href="https://www.av40.nl/index.php?page=Inschrijfformulier&sid=1" className="meetrainen_4">*/}
                {/*    <p>Schrijf je in!</p>*/}
                {/*</a>*/}
                <p className="meetrainen_uitschrijven">Wil je je uitschrijven bij D.S.A.V. Dodeka? Stuur dan uiterlijk 4 weken voor het einde van het kwartaal een mailtje naar <a target="_blank" rel="noreferrer" href="mailto:bestuur@dsavdodeka.nl" className="meetrainen_uitschrijflink">bestuur@dsavdodeka.nl</a>. Onze kwartalen lopen van september t/m november, december t/m februari, maart t/m mei en juni t/m augustus.</p>
                <p className="meetrainen_5">Mocht je nu nog vragen hebben, kijk dan in onze <Link to="/contact#faq" className="meetrainen_6">F.A.Q.</Link>, of stuur een berichtje via de mail of Instagram!</p>
                <ContactButtons />
            </div>
            <img src={getNestedImagesUrl(`word_lid/${props.foto}`)} alt="" className="meetrainen_7" />
        </div>
    )
}

export default Meetrainen;
