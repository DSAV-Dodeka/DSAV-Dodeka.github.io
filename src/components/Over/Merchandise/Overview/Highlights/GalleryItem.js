import React from "react";
import GalleryFoto from "./GalleryFoto";
import placeholder from "../../../../../images/placeholder.png";

function GalleryItem(props) {
    return(
        <div class ={(props.hidden ? " hidden" : "")}>
            <div class="flex justify-between">
                <h1 class="inline text-left text-3xl text-blauw font-bold">{props.name}</h1>
                <h1 class="inline text-right text-3xl text-blauw font-bold">{props.price}</h1>
            </div>
            <GalleryFoto image={props.image}/>
        </div>
        
 
    )
}

export default GalleryItem;

