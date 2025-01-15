import React from "react";
import "./OWeeImageBar.scss";
import {getNestedImagesUrl} from "../../../functions/links";

function OWeeText() {
    return(
        <div className="OWeeImageBar">
            <img className="OWeeImage" src={getNestedImagesUrl("owee/atletiek.jpg")}/>
            <img className="OWeeImage" src={getNestedImagesUrl("owee/track_festival.jpg")}/>
            <img className="OWeeImage" src={getNestedImagesUrl("owee/mario_krat.JPG")}/>
            
        </div>
    )
}

export default OWeeText;