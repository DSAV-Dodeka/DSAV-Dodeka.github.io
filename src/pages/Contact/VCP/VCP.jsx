import React from "react";
import PageTitle from "../../../components/PageTitle";
import Header from "../../../components/Header";
import "./VCP.scss"
import {getNestedImagesUrl} from "../../../functions/links";

function Vertrouwenscontactpersoon(){
    return (
        <div className="vcp_container">
                <PageTitle title="Vertrouwenscontactpersonen"/>

            <div className="vcp_algemeen">
                <Header text="Wat doen wij?"/>
                <p>
                    Als vertrouwenscontactpersonen (VCP) houden wij ons bezig met het behouden van een veilige sportomgeving waar iedereen zich thuis voelt. Mochten er dingen gebeuren of mocht je dingen opmerken waarvan je denkt dat dat niet door de beugel kan of zorgt voor een onveilige/onaangename omgeving onder leden/trainers/bestuurders of eventuele andere betrokkenen van de vereniging, laat dat dan vooral weten bij ons. Dit kan natuurlijk allemaal anoniem worden gedaan mocht je dat fijn vinden.
                    <br/><br/>
                    Groetjes de VCP’s van Dodeka,
                    <br/>
                    Lisa Meijndert, Niels Verheugd, Annejet van Dam en Roy Peters
                </p>
            </div>    
            <div className="vcp_persoon vcp_left">
                <img className="vcp_img" src={getNestedImagesUrl("vcp/vcp_lisa.jpg")}/>
                <p className="vcp_naam">Lisa Meijndert</p>
                E-mail: <a className="vcp_mail" href="mailto:vcplisa.dsavdodeka@gmail.com">vcplisa.dsavdodeka@gmail.com</a>
            </div>
            <div className="vcp_persoon vcp_right">
                <img className="vcp_img" src={getNestedImagesUrl("vcp/vcp_niels.jpg")}/> 
                <p className="vcp_naam">Niels Verheugd</p>
                E-mail: <a className="vcp_mail" href="mailto:vcpniels.dsavdodeka@gmail.com">vcpniels.dsavdodeka@gmail.com</a>
            </div>
            <div className="vcp_persoon vcp_left">
            <img className="vcp_img" src={getNestedImagesUrl("vcp/vcp_annejet.jpg")}/>
                <p className="vcp_naam">Annejet van Dam</p>
                E-mail: <a className="vcp_mail" href="mailto:vcpannejet.dsavdodeka@gmail.com">vcpannejet.dsavdodeka@gmail.com</a>
            </div>
            <div className="vcp_persoon vcp_right">
            <img className="vcp_img" src={getNestedImagesUrl("vcp/vcp_roy.jpg")}/>
                <p className="vcp_naam">Roy Peters</p>
                E-mail: <a className="vcp_mail" href="mailto:vcproy.dsavdodeka@gmail.com">vcproy.dsavdodeka@gmail.com</a>
            </div>
            
        </div>
    )
}

export default Vertrouwenscontactpersoon;