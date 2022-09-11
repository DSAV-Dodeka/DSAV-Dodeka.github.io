import React from "react";
import {
    Link
} from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import EigenWedstrijd from "./components/EigenWedstrijd";
import TextWedstrijden from "../../content/Wedstrijden.json";
import records from "../../images/wedstrijden/records.png";
import "./Wedstrijden.scss";

function wedstrijdGeweest(dateString) {
    var date = new Date(dateString.split('/').reverse().join('-'));
    return date < new Date();
}

function Wedstrijden() {

    return(
        <div>
            <PageTitle title="Wedstrijden"/>
            <div id="eigenWedstrijden">
                {TextWedstrijden.wedstrijden.map(wedstrijd => 
                    <EigenWedstrijd naam={wedstrijd.naam} datum={wedstrijd.datum} logo={wedstrijd.logo} info_kort={wedstrijd.info_kort} path={wedstrijd.path} oud={wedstrijdGeweest(wedstrijd.datum)} />
                )}
            </div>
            <div className="wedstrijden_routes">
                <Link className="wedstrijden_records" to='records' >
                    <h1 className="wedstrijden_link_header">Records</h1>
                    <img src={records} className="wedstrijden_link_image" alt=""/>
                </Link>
                {/* <Link className="vereniging_9" to='commissies' >
                    <h1 className="vereniging_10">Commissies</h1>
                    <img src={commissie} className="vereniging_11" alt=""/>
                </Link> */}
                {/* <Link className="vereniging_9" to={`${match.url}/merchandise`} >
                <h1 className="vereniging_10">Merchandise</h1>
                    <img src={merch} className="vereniging_11" alt=""/>
                </Link> */}
            </div>
        </div>
    )
}

export default Wedstrijden;