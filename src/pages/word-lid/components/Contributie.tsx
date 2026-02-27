import Header from "../../../components/Header";
import "./Contributie.scss";

function Contributie() {
  return (
    <div className="contributie_1">
      <div className="jesper_probeert_flex">
        <div className="contributieTabel1">
          Wedstrijdlid
          <span className="jaapie">
            <sup> 1</sup>
          </span>{" "}
          <br />
          Recreantlid
          <span className="jaapie">
            <sup> 2</sup>
          </span>{" "}
          <br />
          Gastlid
          <span className="jaapie">
            <sup> 2</sup>
          </span>{" "}
          <br />
          Inschrijfgeld <br />
        </div>
        <div className="vl"></div>
        <div className="contributieTabel2">
          <span>&#8364;</span>53,5 <span className="jaapie">per kwartaal</span>
          <br />
          <span>&#8364;</span>47,- <span className="jaapie">per kwartaal</span>
          <br />
          <span>&#8364;</span>44,- <span className="jaapie">per kwartaal</span>
          <br />
          <span>&#8364;</span>5,- <span className="jaapie">eenmalig</span>
          <br />
          <span className="footnote_contributie">
            <div>
              <sup>1</sup>:Inclusief wedstrijdlicentie
            </div>
            <div>
              <sup>2</sup>:Exclusief wedstrijdlicentie
            </div>
          </span>
        </div>
      </div>
      <div className="contributie_3">
        <Header text="Contributie" position="right" />
        <p className="contributie_4">
          Als wedstrijdlid kan je deelnemen aan alle trainingen, activiteiten en wegwedstrijden. Je krijgt een wedstrijdlicentie bij de Atletiekunie en kan daardoor ook deelnemen aan wedstrijden op de baan. 
          <br /> <br />
          Als recreantlid kan je deelnemen aan alle trainingen, activiteiten en wegwedstrijden, maar niet aan wedstrijden op de baan.
          <br /> <br />
          Als gastlid kan je deelnemen aan alle trainingen, activiteiten en wegwedstrijden. Je hebt al een wedstrijdlicentie bij een andere atletiekvereniging en komt op baanwedstrijden ook uit voor deze vereniging. Een uitzondering geldt voor de Nationale Studenten Kampioenschappen (NSK's), hier mag je wel uitkomen voor Dodeka.
        </p>
      </div>
    </div>
  );
}
export default Contributie;
