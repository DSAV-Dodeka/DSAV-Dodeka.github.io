import React from "react";

// Component representing the title of a Niewsbericht component.
function Title(props) {
    return(
        <div class="w-full py-2 bg-tartan_rood font-rajdhani">
            {/* Text is positioned on the right or left based on props.position. */}
            <h1 class={"mx-16 text-3xl text-white font-bold " + (props.position === "left" ? " text-left" : " text-right")}>
                {props.title}
            </h1>
        </div>
    )
}

export default Title;