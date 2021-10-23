import React from "react";
import GalleryFoto from "./GalleryFoto";

function GalleryItem(props) {
    return(
        <div class ={(props.hidden ? " hidden" : "")}>
            <div class="flex justify-between pb-4">
                <h1 class="inline text-left text-xl text-blauw font-bold">{props.name}</h1>
                <h1 class="inline text-right text-xl text-blauw font-bold">{props.price}</h1>
            </div>
            <GalleryFoto image={props.image}/>
        </div>
        
 
    )
}

export default GalleryItem;

