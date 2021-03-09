import React from "react";

function Title(props) {
    return(
        <div class="w-full py-2 bg-rood font-rajdhani">
            <h1 class="mx-16 text-4xl text-white font-bold text-center">
                {props.title}
            </h1>
        </div>
    )
}

export default Title;