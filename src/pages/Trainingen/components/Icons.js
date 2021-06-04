import React from "react";
import icons from "../../../images/trainingen/icons.png";
import "./Icons.css"

function Icons() {
    return(
        <div id="icons" class="h-16 mt-8 w-full" style={{ backgroundImage: `url(${icons})` }} />
    )
}
export default Icons;