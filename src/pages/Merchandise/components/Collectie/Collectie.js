import React from "react";
import Title from "./Title";
import CollectieItem from "./CollectieItem";

function Collectie(props) {
    return(
        <div class="w-full my-8 font-rajdhani">
            <Title title={props.title}/>
            <div class="grid ml-12 lg:ml-16 grid-cols-1 lg:grid-cols-3 mb-16 lg:mb-24">
                {props.items.map((item) => (
                    <CollectieItem title={item.title} price={item.price} foto={item.image} text={props.text}/>
                ))}
                
            </div>
            
        </div>
    )
}

export default Collectie;