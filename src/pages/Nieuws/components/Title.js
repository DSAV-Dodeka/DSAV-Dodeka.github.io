import React from "react";

function Title(props) {
    return(
        <div class="w-full py-2 bg-rood">
            <h1 class={"mx-4 lg:mx-16 text-xl text-white font-bold " + (props.position === "left" ? " text-left" : " text-right")}>
                {props.title}
            </h1>
        </div>
    )
}

export default Title;