import React from "react";
import PageTitle from "../../../components/PageTitle";
import Header from "../../../components/Header";
import "./VCP.scss"
import getUrl from "../../../functions/links";

function Vertrouwenscontactpersoon(){
    return (
        <div className="vcp_container">
                <PageTitle title="Vertrouwenscontactpersonen"/>

            <div className="vcp_algemeen">
                <Header text="Wat doen wij?"/>
                <p>
                    Als vertrouwenscontactpersonen (VCP) houden wij ons bezig met het behouden van een veilige sportomgeving waar iedereen zich thuis voelt. Mochten er dingen gebeuren of mocht je dingen opmerken waarvan je denkt dat dat niet door de beugel kan of zorgt voor een onveilige/onaangename omgeving onder leden/trainers/bestuurders of eventuele andere betrokkenen van de vereniging, laat dat dan vooral weten bij ons. Dit kan natuurlijk allemaal anoniem worden gedaan mocht je dat fijn vinden. Mocht je dat willen kan je uiteraard ook bij Lizeth en Lorenzo, de VCP’s van AV’40 terecht.
                    <br/><br/>
                    Groetjes de VCP’s van Dodeka,
                    <br/>
                    Lisa Meijndert en Niels Verheugd
                </p>
            </div>    
            <div className="vcp_persoon vcp_left">
                <img className="vcp_img" src={getUrl("vcp/vcp_lisa.jpg")}/>
                <p className="vcp_naam">Lisa Meijndert</p>
                E-mail: <a className="vcp_mail" href="mailto:vcp.lisa@dsavdodeka.nl">vcp-lisa@dsavdodeka.nl</a>
            </div>
            <div className="vcp_persoon vcp_right">
                <img className="vcp_img" src={getUrl("vcp/vcp_niels.jpg")}/> 
                <p className="vcp_naam">Niels Verheugd</p>
                E-mail: <a className="vcp_mail" href="mailto:vcp.niels@dsavdodeka.nl">vcp.niels@dsavdodeka.nl</a>
            </div>
            <div className="vcp_persoon vcp_left">
                <p className="vcp_naam">Annejet van Dam</p>
                E-mail: <a className="vcp_mail" href="mailto:vcp.annejet@dsavdodeka.nl">vcp.annejet@dsavdodeka.nl</a>
            </div>
            <div className="vcp_persoon vcp_right">
                <p className="vcp_naam">Roy Peters</p>
                E-mail: <a className="vcp_mail" href="mailto:vcp.roy@dsavdodeka.nl">vcp.roy@dsavdodeka.nl</a>
            </div>
            
        </div>
    )
}

export default Vertrouwenscontactpersoon;