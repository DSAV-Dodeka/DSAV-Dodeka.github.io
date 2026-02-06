import { Link } from "react-router";
import Header from "../../../components/Header";
import ContactButtons from "../../../components/ContactButtons";
import "./Meetrainen.scss";
import wordlid from "$images/word_lid/wordLid.jpg";

function Meetrainen() {
  return (
    <div className="meetrainen_1">
      <div className="meetrainen_2">
        <Header text="Proeftrainen en inschrijven" position="left" />
        <p className="meetrainen_3">
          Bij D.S.A.V. Dodeka krijg je het hele jaar door de mogelijkheid om
          drie keer gratis te komen proeftrainen. Zo kun je de sfeer proeven en
          erachter komen of atletiek iets voor jou is. Lijkt het je leuk om een
          keer mee te trainen? Geef je dan op via de mail of via een DM op
          Instagram. Heb je na de proeftrainingen de smaak te pakken en wil je
          lid worden? Schrijf je dan in via de onderstaande knop:
        </p>
        <a href="/registreer">
          <button className="schrijfInButton" id="submit_button" type="submit">
            Inschrijven
          </button>
        </a>
        <p className="meetrainen_uitschrijven">
          Wil je je uitschrijven bij D.S.A.V. Dodeka? Stuur dan uiterlijk 4
          weken voor het einde van het kwartaal een mailtje naar{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="mailto:bestuur@dsavdodeka.nl"
            className="meetrainen_uitschrijflink"
          >
            bestuur@dsavdodeka.nl
          </a>
          . Onze kwartalen lopen van september t/m november, december t/m
          februari, maart t/m mei en juni t/m augustus.
        </p>
        <p className="meetrainen_5">
          Mocht je nu nog vragen hebben, kijk dan in onze{" "}
          <Link to="/contact#faq" className="meetrainen_6">
            F.A.Q.
          </Link>
          , of stuur een berichtje via de mail of Instagram!
        </p>
        <ContactButtons />
      </div>
      <img src={wordlid} alt="" className="meetrainen_7" />
    </div>
  );
}

export default Meetrainen;
