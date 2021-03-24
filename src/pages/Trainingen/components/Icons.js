import React from "react";
import icons from "../../../images/icons.png";
import "./Icons.css"

function Icons() {
    return(
        <div id="icons" class="h-16 w-full" style={{ backgroundImage: `url(${icons})` }} />
    )
}
export default Icons;