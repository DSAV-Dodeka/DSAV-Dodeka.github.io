import React from "react";
import "./SubMenuItem.scss";

function SubMenuItem(props) {

    return (
        <div id="subMenu" className="relative h-16 w-full lg:h-24 lg:w-32 border-b-2 border-white">
            <svg id="subMenu_arrow" className="absolute top-4 left-4 z-20 w-8 text-center text-white stroke-current self-center cursor-pointer" viewBox="0 0 32 32" onClick={props.onClick}>
                <path d="M16 8 L8 16 L16 24" fill="none" strokeWidth="4" />
            </svg>
            <h1>{props.name}</h1>
        </div>
    )
}

export default SubMenuItem;