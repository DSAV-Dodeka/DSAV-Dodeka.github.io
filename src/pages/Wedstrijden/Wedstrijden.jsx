import React from "react";
import PageTitle from "../../components/PageTitle";
import EigenWedstrijd from "./components/EigenWedstrijd";
import TextWedstrijden from "../../content/Wedstrijden.json";
import "./Wedstrijden.scss";

function Wedstrijden() {

    return(
        <div>
            <PageTitle title="Wedstrijden"/>
            <div id="eigenWedstrijden">
                {TextWedstrijden.wedstrijden.map(wedstrijd => 
                    <EigenWedstrijd naam={wedstrijd.naam} datum={wedstrijd.datum} logo={wedstrijd.logo} info_kort={wedstrijd.info_kort} path={wedstrijd.path}/>
                )}
                {/* <div id="wedstrijdenPaging">
                    {TextWedstrijden.wedstrijden.map((wedstrijd, index) => 
                        <div className="wedstrijdenPagingCircle"/>
                    )}
                </div> */}
            </div>
        </div>
    )
}

export default Wedstrijden;