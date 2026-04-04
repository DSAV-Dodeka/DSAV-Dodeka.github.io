import Header from "../../../../components/Header";
import "./Sponsoropties.scss";
import maltha from "$images/sponsors/maltha.png";
import muconsult from "$images/sponsors/muconsult.png";
import boozed from "$images/sponsors/boozed.png";
import sponsoropties from "$images/sponsors/sponsoropties.webp";
import virtuoos from "$images/sponsors/virtuoos.webp";


function Sponsoropties() {
  return (
    <div className="sponsoropties_1">
      <div className="sponsoropties_2">
        <Header text="Sponsor ons!" position="left" />
        <p className="sponsoropties_3">
          D.S.A.V. Dodeka staat altijd open voor nieuwe sponsorsamenwerkingen
          zodat we atletiek voor nog meer Delftse studenten mogelijk en leuker
          kunnen maken. We bieden veel mogelijkheden om uw organisatie met meer
          studenten binnen en buiten Delft in contact te brengen. De opties
          variëren van advertenties in het jaarboek of op instagram tot logo’s
          op het shirt of website. Indien u geïnteresseerd bent in sponsoren
          kunt u voor meer informatie mailen naar{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="linktomail_1"
            href="mailto:samenwerking@dsavdodeka.nl"
          >
            samenwerking@dsavdodeka.nl
          </a>
          .
        </p>

      <Header text= "Hardloopclinics" position ="left"/>
        <p className="sponsoropties_3">
          Bij Dodeka bieden wij een hardloopclinic aan, waarbij uw team alle tips krijgt om bij de volgende bedrijvenloop nu eens vóór de concurrent te eindigen. 
          De training wordt gegeven door een ervaren atletiektrainer. Uw team krijgt tips over looptechniek en trainingsopbouw. 
          Na de clinic krijgt u wekelijks een schema opgestuurd om naar uw afstand toe te werken en een mooie tijd neer te zetten.
          Daarnaast krijgt u toegang tot de Whatsapp hotline, waar een trainer eventuele vragen in aanloop naar de wedstrijd zal beantwoorden.
          <br></br>
          <br></br>
          Past deze vorm niet helemaal bij u, maar heeft u wel een ander leuk idee? Stel het vooral voor! Wij zijn erg flexibel en denken graag met u mee om een mooi resultaat te behalen. 
        </p>
        <Header text= "Werkacties" position ="left"/>
        <p className="sponsoropties_3">
          De leden van Dodeka voeren regelmatig werkacties uit bij evenementen, om extra inkomsten te verwerven voor de vereniging.
          Een werkactie is voor de leden een leuke en gezellige ervaring en een laagdrempelige manier om een steentje bij te dragen aan de vereniging. 
          Onze leden zijn enthousiast, flexibel en gewend om samen te werken in een team. Organiseert u een evenement en bent u op zoek naar hulpkrachten? 
          Neem gerust contact met ons op, dan bespreken we de mogelijkheden. 
        </p>
        <Header text="Huidige sponsors" position="left" />
        <div className="sponsoropties_4">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.malthasport.nl/"
          >
            <img
              src={maltha}
              alt="Maltha Sport"
              className="sponsoropties_5 maltha"
            ></img>
          </a>
          <a target="_blank" rel="noreferrer" href="https://muconsult.nl/">
            <img
              src={muconsult}
              alt="MuConsult"
              className="sponsoropties_5 muconsult"
            ></img>
          </a>
          <a target="_blank" rel="noreferrer" href="https://www.boozed.nl/">
            <img
              src={boozed}
              alt="Boozed"
              className="sponsoropties_5 boozed"
            ></img>
          </a>
          <a target="_blank" rel="noreferrer" href="https://www.virtuoos.com/">
            <img
              src={virtuoos}
              alt="virtuoos"
              className="sponsoropties_5 virtuoos"
            ></img>
          </a>
        </div>
      </div>
      <img src={sponsoropties} alt="" className="sponsoropties_6" />
    </div>
  );
}
export default Sponsoropties;
