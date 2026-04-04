import PageTitle from "../../../components/PageTitle";
import Header from "../../../components/Header";
import "./VCP.scss";
import vcpLisa from "$images/vcp/vcp_lisa.webp";
import vcpNiels from "$images/vcp/vcp_niels.webp";
import vcpAnnejet from "$images/vcp/vcp_annejet.webp";
import vcpRoy from "$images/vcp/vcp_roy.webp";

function Vertrouwenscontactpersoon() {
  return (
    <div className="vcp_container">
      <PageTitle title="Vertrouwenscontactpersonen" />

      <div className="vcp_algemeen">
        <Header text="Wat doen wij?" />
        <p>
          Als vertrouwenscontactpersonen (VCP) houden wij ons bezig met het
          behouden van een veilige sportomgeving waar iedereen zich thuis voelt.
          Mochten er dingen gebeuren of mocht je dingen opmerken waarvan je
          denkt dat dat niet door de beugel kan of zorgt voor een
          onveilige/onaangename omgeving onder leden/trainers/bestuurders of
          eventuele andere betrokkenen van de vereniging, laat dat dan vooral
          weten bij ons. Dit kan natuurlijk allemaal anoniem worden gedaan mocht
          je dat fijn vinden.
          <br />
          <br />
          Groetjes de VCP’s van Dodeka,
          <br />
          Lisa Meijndert, Niels Verheugd, Annejet van Dam en Roy Peters
        </p>
      </div>
      <div className="vcp_persoon vcp_left">
        <img className="vcp_img" src={vcpLisa} />
        <p className="vcp_naam">Lisa Meijndert</p>
        E-mail:{" "}
        <a className="vcp_mail" href="mailto:vcplisa.dsavdodeka@gmail.com">
          vcplisa.dsavdodeka@gmail.com
        </a>
      </div>
      <div className="vcp_persoon vcp_right">
        <img className="vcp_img" src={vcpNiels} />
        <p className="vcp_naam">Niels Verheugd</p>
        E-mail:{" "}
        <a className="vcp_mail" href="mailto:vcpniels.dsavdodeka@gmail.com">
          vcpniels.dsavdodeka@gmail.com
        </a>
      </div>
      <div className="vcp_persoon vcp_left">
        <img className="vcp_img" src={vcpAnnejet} />
        <p className="vcp_naam">Annejet van Dam</p>
        E-mail:{" "}
        <a className="vcp_mail" href="mailto:vcpannejet.dsavdodeka@gmail.com">
          vcpannejet.dsavdodeka@gmail.com
        </a>
      </div>
      <div className="vcp_persoon vcp_right">
        <img className="vcp_img" src={vcpRoy} />
        <p className="vcp_naam">Roy Peters</p>
        E-mail:{" "}
        <a className="vcp_mail" href="mailto:vcproy.dsavdodeka@gmail.com">
          vcproy.dsavdodeka@gmail.com
        </a>
      </div>
    </div>
  );
}

export default Vertrouwenscontactpersoon;
