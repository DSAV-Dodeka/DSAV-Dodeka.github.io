import React, { useState } from "react";
import GalleryItem from "./GalleryItem";
import placeholder from "../../../../../images/placeholder.png";
import droste from "../../../../../images/nieuwsPagina.png";

const maxIndex = 1;

function Gallery(props) {
    const [activeIndex, setActiveIndex] = useState(0);

    return(
        <div class="flex mt-8 mx-16 pt-2 pb-8 bg-white">
            <h1 class="inline w-32 text-center self-center" onClick={() => setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1)}>left</h1>
            <div class="inline flex-grow">
                <GalleryItem name="Windjack" price="€29,00" hidden={activeIndex === 0} image={placeholder}/>
                <GalleryItem name="Singlet" price="€15,00" hidden={activeIndex === 1} image={droste}/>
            </div>
            <h1 class="inline w-32 text-center self-center" onClick={() => setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1)}>right</h1>
        </div>   
    )
}

export default Gallery;

