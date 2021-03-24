import React from "react";

function Foto(props) {
    return(
        <div class={"transition duration-500 w-1/4 absolute -top-4 border-4 border-white rounded-3xl transform hover:scale-150" + (props.position === "left" ? " hover:-translate-x-64 right-16" : " hover:translate-x-64 left-16")}>
            <img class="object-fill h-48 w-full border-4 border-rood rounded-2xl" src={props.image} alt=""/>
        </div>
    )
}

export default Foto;