import React from "react";
import "./OWeeImageBar.scss";
import getUrl from "../../../functions/links";

function OWeeText() {
    return(
        <div className="OWeeImageBar">
            <img className="OWeeImage" src={getUrl("owee/trainingen.jpg")}/>
            <img className="OWeeImage" src={getUrl("owee/nsk_teams_algemeen.jpeg")}/>
            <img className="OWeeImage" src={getUrl("owee/wordLid.jpg")}/>
            
        </div>
    )
}

export default OWeeText;