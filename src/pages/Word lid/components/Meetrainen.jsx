import React from "react";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import {
    Link
} from "react-router-dom";
import Header from "../../../components/Header";
import ContactButtons from "../../../components/ContactButtons";
import "./Meetrainen.scss"
import getUrl from "../../../functions/links";
import SchrijfIn from "./SchrijfIn";

function Meetrainen(props) {
    return (
        <div className="meetrainen_1">
            <div className="meetrainen_2">
                <Header text="Proeftrainen en inschrijven" position="left" />
                <p className="meetrainen_3">
                  Bij Dodeka krijg je het hele jaar door de mogelijkheid om drie keer gratis te komen proeftrainen. Zo kun je de sfeer proeven en erachter komen of atletiek iets voor jou is. Lijkt het je leuk om een keer mee te trainen? Geef je dan op via de mail of via een DM op Instagram. Heb je na de proeftrainingen de smaak te pakken en wil je lid worden? Inschrijvingen verlopen via AV'40 en hun inschrijfformulier vind je hieronder.
                </p>
                <SchrijfIn />
                {/*<a target="_blank" rel="noreferrer" href="https://www.av40.nl/index.php?page=Inschrijfformulier&sid=1" className="meetrainen_4">*/}
                {/*    <p>Schrijf je in!</p>*/}
                {/*</a>*/}
                <p className="meetrainen_uitschrijven">Wil je je uitschrijven bij Dodeka? Stuur dan een mailtje naar de ledenadministratie van AV'40 (<a target="_blank" rel="noreferrer" href="mailto:ledenadministratie@av40.nl" className="meetrainen_uitschrijflink">ledenadministratie@av40.nl</a>).</p>
                <p className="meetrainen_5">Mocht je nu nog vragen hebben, kijk dan in onze <Link to="/contact#faq" className="meetrainen_6">F.A.Q.</Link>, of stuur een berichtje via de mail of Instagram!</p>
                <ContactButtons />
            </div>
            <img src={getUrl(`word_lid/${props.foto}`)} alt="" className="meetrainen_7" />
        </div>
    )
}

export default Meetrainen;
