import React from "react";
import PageTitle from "../../../components/PageTitle";
import "./Agenda.scss";

function Agenda() {

    return(
        <div>
            <PageTitle title="Agenda" />
            <div className="agendaContainer">
                <iframe
                className="agendaPC" 
                sandbox
                src="https://calendar.google.com/calendar/embed?&wkst=2&ctz=Europe%2FAmsterdam&showPrint=0&showTitle=0&showTabs=0&showTz=0&mode=MONTH&src=Y182MzgxbzB0azZrN2Nvcm05bjRtcjdhaWJoNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%001f48"></iframe>
            
                <iframe
                className="agendaMobile" 
                data
                src="https://calendar.google.com/calendar/embed?&wkst=2&ctz=Europe%2FAmsterdam&showPrint=0&showTitle=0&showTabs=0&showTz=0&mode=AGENDA&src=Y182MzgxbzB0azZrN2Nvcm05bjRtcjdhaWJoNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%001f48"></iframe>
            </div>
        </div>
    )
}

export default Agenda;