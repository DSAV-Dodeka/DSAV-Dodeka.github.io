import React from "react";

function CollectieItem(props) {
    return(
        <div class="mt-8 w-96 font-rajdhani">
            <img class="object-fill h-96 w-96 border-4 border-blauw rounded-2xl" src={props.image} alt=""/>
            <h1 class="text-blauw text-3xl font-medium">{props.title}</h1>
            <h1 class="text-rood text-xl">{props.price}</h1>
        </div>
    )
}

export default CollectieItem;