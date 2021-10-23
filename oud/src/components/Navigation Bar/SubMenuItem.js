import React from "react";

const regularStyle = "absolute h-16 lg:h-24 w-full lg:w-32 py-4 lg:py-8 bg-blauw text-center text-white lg:hover:bg-white lg:hover:text-blauw text-xl font-medium border-b-2 border-white";

function SubMenuItem(props) {

    return (
        <div class="relative h-16 w-full lg:h-24 lg:w-32 border-b-2 border-white">
            <svg class="absolute top-4 left-4 z-20 w-8 text-center text-white stroke-current self-center cursor-pointer" viewBox="0 0 32 32" onClick={props.onClick}>
                <path d="M16 8 L8 16 L16 24" fill="none" stroke-width="4" />
            </svg>
            <h1 class={regularStyle}>{props.name}</h1>
        </div>
    )
}

export default SubMenuItem;