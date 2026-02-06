import old_foto from "../../../images/vereniging/oudleden/old_temp.webp";
import "./OLD.scss";
import PageTitle from "../../../components/PageTitle";

function OLD() {
  return (
    <div>
      <PageTitle title="Oud Leden Dodeka" />
      <div className="oldInfo">
        <div className="oldText">
          <p>
            Je tijd bij Dodeka mag dan wel afgelopen zijn, maar dat betekent
            niet dat je alle leuke, wilde, sportieve herinneringen van toen
            achter je hoeft te laten. Oud-Leden Dodeka, OLD, de
            oud-ledenvereniging van Dodeka biedt je de mogelijkheid blijvende
            banden te onderhouden onderling en met Dodeka. OLD is dé manier om
            in je nieuwe leven verbonden te blijven met je studententijd van
            vroeger en de toekomst van Dodeka te ondersteunen.
          </p>

          <p>
            OLD organiseert activiteiten, waaronder een jaarlijkse reüniedag, en
            faciliteert communicatie met andere oud-leden. Zo kun je zelf
            bepalen hoe actief je betrokken blijft. Met een nieuwsbrief word je
            low-key op de hoogte gehouden van wat er speelt binnen OLD en
            Dodeka.
          </p>

          <p>
            Enthousiast geworden? Voor vragen en inschrijven, mail naar{" "}
            <a href="mailto:ouddodeka@gmail.com">ouddodeka@gmail.com</a>. Wil je
            meteen in de OLD appgroep? Stuur dan je telefoonnummer mee via de
            mail!
          </p>
        </div>
        <img className="oldFoto" src={old_foto} alt="" />
      </div>
    </div>
  );
}

export default OLD;
