import React from "react";

function GalleryFoto(props) {
    return(
        <img class="object-fill h-64 lg:h-96 w-full border-4 border-blauw rounded-2xl" src={props.image} alt=""/>
    )
}

export default GalleryFoto;