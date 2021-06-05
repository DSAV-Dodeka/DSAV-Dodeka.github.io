import React from "react";
import "./CardFlip.css";

function CollectieItem(props) {
    return(
        <div class="mt-8 w-64">
            <div class="card h-64 w-64">
                <div class="inner relative">
                    <div class="front absolute">
                        <img class="object-fill h-64 w-64 border-4 border-blauw rounded-2xl" src={require(`../../../../images/merchandise/${props.foto}`).default} alt=""/>
                    </div>
                    <div class="back absolute bg-blauw text-white w-64 h-64 rounded-2xl text-center text-base p-2 ">
                        <h1>{props.text}</h1>
                    </div>
                </div>
            </div>
            <h1 class="text-blauw text-xl font-medium">{props.title}</h1>
            <h1 class="text-rood text-lg">{props.price}</h1>
        </div>
    )
}

export default CollectieItem;