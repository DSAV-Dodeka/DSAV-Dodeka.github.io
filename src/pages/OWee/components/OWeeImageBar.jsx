import React from "react";
import "./OWeeImageBar.scss";
import getUrl from "../../../functions/links";

function OWeeText() {
    return(
        <div className="OWeeImageBar">
            <img className="OWeeImage" src={getUrl("owee/atletiek.jpg")}/>
            <img className="OWeeImage" src={getUrl("owee/track_festival.jpg")}/>
            <img className="OWeeImage" src={getUrl("owee/mario_krat.JPG")}/>
            
        </div>
    )
}

export default OWeeText;