import React from "react";
import "./Icons.scss";
import getUrl from "../../../functions/links";

function Icons() {
    return(
        <div id="icons" className="icons_1" style={{ backgroundImage: `url(${getUrl(`trainingen/icons.svg`)})` }} />
    )
}
export default Icons;