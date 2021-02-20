import React from "react";

function Foto(props) {
    return(
        <div class={"w-1/4 absolute top-4 border-4 border-white rounded-3xl" + (props.position === "left" ? " right-16" : " left-16")}>
            <img class="object-fill h-48 w-full border-4 border-tartan_rood rounded-2xl" src={props.image} alt=""/>
        </div>
    )
}

export default Foto;