import React, { useState } from "react";
import PageTitle from "../../components/PageTitle";
import EigenWedstrijd from "./components/EigenWedstrijd";
import TextWedstrijden from "../../content/Wedstrijden.json";
import "./Wedstrijden.scss";

function Wedstrijden() {
    const nWedstrijden = TextWedstrijden.wedstrijden.length;
    const [activeWedstrijd, setActiveWedstrijd] = useState(0);

    return(
        <div>
            <PageTitle title="Wedstrijden"/>
            <div id="eigenWedstrijden">
                {TextWedstrijden.wedstrijden.map(wedstrijd => 
                    <EigenWedstrijd naam={wedstrijd.naam} datum={wedstrijd.datum} foto={wedstrijd.foto} info={wedstrijd.info} path={wedstrijd.path}/>
                )}
                <div id="wedstrijdenPaging">
                    {TextWedstrijden.wedstrijden.map((wedstrijd, index) => 
                        <div className="wedstrijdenPagingCircle"/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Wedstrijden;