import React from "react";
import icons from "../../../images/trainingen/icons.svg";
import "./Icons.css"

function Icons() {
    return(
        <div id="icons" class="h-16 lg:h-20 lg:mt-4 w-full" style={{ backgroundImage: `url(${icons})` }} />
    )
}
export default Icons;