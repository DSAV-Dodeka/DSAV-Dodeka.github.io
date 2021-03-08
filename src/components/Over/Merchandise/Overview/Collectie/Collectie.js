import React from "react";
import Title from "./Title";
import CollectieItem from "./CollectieItem";

function Collectie(props) {
    return(
        <div class="w-full my-8 font-rajdhani">
            <Title title={props.title}/>
            <div class="grid ml-16 grid-rows-1 grid-cols-3">
                {props.items.map((item) => (
                    <CollectieItem title={item.title} price={item.price} image={item.image} />
                ))}
                
            </div>
            
        </div>
    )
}

export default Collectie;