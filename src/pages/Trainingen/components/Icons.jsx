import React from "react";
import "./Icons.scss";
import {getNestedImagesUrl} from "../../../functions/links";
import icons from "$images/trainingen/icons.svg";

function Icons() {
    return(
        <div id="icons" className="icons_1" style={{ backgroundImage: `url(${icons})` }} />
    )
}
export default Icons;