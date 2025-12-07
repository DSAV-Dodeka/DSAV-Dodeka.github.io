import React from "react";
import {
    Link
} from "react-router";
import PageTitle from "../../../components/PageTitle";
import EigenWedstrijd from "./components/EigenWedstrijd";
import TextWedstrijden from "../../../content/Wedstrijden.json";
import records from "../../../images/wedstrijden/records.png";
import "./Wedstrijden.scss";

const dateMap = {"januari": "jan", "februari": "feb", "maart": "mar", "april": "apr", "mei": "may", "juni": "jun", "juli": "jul", "augustus": "aug", "september": "sep", "oktober": "oct", "november": "nov", "december": "dec"}

export function wedstrijdGeweest(dateString) {
    if (dateString.includes("en")) dateString = dateString.split("en")[1];
    for (var month in dateMap) {
        if (dateString.toLowerCase().includes(month)) dateString = dateString.replace(month, dateMap[month]);
    }
    var date = new Date(dateString.split('/').reverse().join('-'));

    return date < new Date();
}

function Wedstrijden() {

    return(
        <div>
            <PageTitle title="Wedstrijden"/>
            <div id="eigenWedstrijden">
                {TextWedstrijden.wedstrijden.map(wedstrijd => 
                    <EigenWedstrijd key={wedstrijd.naam + wedstrijd.datum} naam={wedstrijd.naam} datum={wedstrijd.datum} logo={wedstrijd.logo} info_kort={wedstrijd.info_kort} path={wedstrijd.path} oud={wedstrijdGeweest(wedstrijd.datum)} />
                )}
            </div>
            <div className="wedstrijden_routes">
                <Link className="wedstrijden_records" to='records' >
                    <h1 className="wedstrijden_link_header">Records</h1>
                    <img src={records} className="wedstrijden_link_image" alt=""/>
                </Link>
            </div>
        </div>
    )
}

export default Wedstrijden;