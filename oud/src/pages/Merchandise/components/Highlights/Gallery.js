import React, { useState } from "react";
import GalleryItem from "./GalleryItem";

function Gallery(props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const maxIndex = props.items.length - 1;
    console.log(maxIndex);

    return(
        <div class="flex mt-8 mx-4 lg:mx-16 pt-2 pb-8 bg-white">
            <svg class="inline w-64 lg:w-32 ml-4 text-center text-blauw stroke-current self-center cursor-pointer" viewBox="0 0 32 32" onClick={() => setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1)}>
                <path d="M16 8 L8 16 L16 24" fill="none" stroke-width="4"/>
            </svg>
            <div class="inline flex-grow">
                {props.items.map((item, index) => 
                <GalleryItem name={item.title} price={item.price} hidden={activeIndex === index} image={item.image}/>
                    )}
            </div>
            <svg class="inline w-64 lg:w-32 mr-4 text-center text-blauw stroke-current self-center cursor-pointer" viewBox="0 0 32 32" onClick={() => setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1)}>
                <path d="M16 8 L24 16 L16 24" fill="none" stroke-width="4"/>
            </svg>
        </div>   
    )
}

export default Gallery;

