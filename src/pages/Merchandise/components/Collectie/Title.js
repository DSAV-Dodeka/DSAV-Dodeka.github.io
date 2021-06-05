import React from "react";

function Title(props) {
    return(
        <div class="w-full py-2 bg-rood font-rajdhani">
            <h1 class="mx-4 lg:mx-16 text-center lg:text-left text-xl text-white font-bold">
                {props.title}
            </h1>
        </div>
    )
}

export default Title;