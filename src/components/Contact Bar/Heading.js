import React from "react";

function Heading(props) {
    return(
        <div class="w-64 relative w-full text-rood bg-white px-4 pb-1 lg:text-center font-bold">
            <h1 class="w-64 inline text-2xl text-left">{props.title.toUpperCase()}</h1>
            <div class="relative inline">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute bottom-0 left-4 bottom-0 my-auto w-5 h-6 fill-current" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
            </div>
            
        </div>
    )
}

export default Heading;