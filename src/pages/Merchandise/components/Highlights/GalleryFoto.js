import React from "react";

function GalleryFoto(props) {
    return(
        <img class="object-fill h-64 lg:h-96 w-full border-4 border-blauw rounded-2xl" src={require(`../../../../images/merchandise/${props.image}`).default} alt=""/>
    )
}

export default GalleryFoto;