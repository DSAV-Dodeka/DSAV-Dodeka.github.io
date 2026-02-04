import React from "react";
import "./OWeeImageBar.scss";
import {getNestedImagesUrl} from "../../../functions/links";
import atletiek from "$images/owee/atletiek.webp";
import trackFestival from "$images/owee/track_festival.webp";
import marioKrat from "$images/owee/mario_krat.webp";

function OWeeText() {
    return(
        <div className="OWeeImageBar">
            <img className="OWeeImage" src={atletiek}/>
            <img className="OWeeImage" src={trackFestival}/>
            <img className="OWeeImage" src={marioKrat}/>
            
        </div>
    )
}

export default OWeeText;