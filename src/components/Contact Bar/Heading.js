import React from "react";

function Heading(props) {
    return(
        <div class="w-full text-rood bg-white px-4 lg:text-center font-bold">
            <h1 class="w-64 inline text-2xl text-left">{props.title.toUpperCase()}</h1>
        </div>
    )
}

export default Heading;