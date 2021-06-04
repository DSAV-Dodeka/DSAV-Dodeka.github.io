import React, { useState } from "react";
import GalleryItem from "./GalleryItem";
import placeholder from "../../../../images/placeholder.png";
import droste from "../../../../images/nieuws/nieuwsPagina.png";

const maxIndex = 1;

function Gallery(props) {
    const [activeIndex, setActiveIndex] = useState(0);

    return(
        <div class="flex mt-8 mx-16 pt-2 pb-8 bg-white">
            <svg class="inline w-16 ml-16 text-center text-blauw stroke-current self-center cursor-pointer" viewBox="0 0 32 32" onClick={() => setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1)}>
                <path d="M16 8 L8 16 L16 24" fill="none" stroke-width="4"/>
            </svg>
            <div class="inline flex-grow">
                <GalleryItem name="Windjack" price="€29,00" hidden={activeIndex === 0} image={placeholder}/>
                <GalleryItem name="Singlet" price="€15,00" hidden={activeIndex === 1} image={droste}/>
            </div>
            <svg class="inline w-16 mr-16 text-center text-blauw stroke-current self-center cursor-pointer" viewBox="0 0 32 32" onClick={() => setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1)}>
                <path d="M16 8 L24 16 L16 24" fill="none" stroke-width="4"/>
            </svg>
        </div>   
    )
}

export default Gallery;

