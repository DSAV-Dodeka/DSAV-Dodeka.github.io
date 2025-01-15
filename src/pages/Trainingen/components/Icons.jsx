import React from "react";
import "./Icons.scss";
import {getNestedImagesUrl} from "../../../functions/links";

function Icons() {
    return(
        <div id="icons" className="icons_1" style={{ backgroundImage: `url(${getNestedImagesUrl(`trainingen/icons.svg`)})` }} />
    )
}
export default Icons;