import React from "react";
import "./OWeeImageBar.scss";
import {getNestedImagesUrl} from "../../../functions/links";
import atletiek from "$images/owee/atletiek.jpg";
import trackFestival from "$images/owee/track_festival.jpg";
import marioKrat from "$images/owee/mario_krat.JPG";

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