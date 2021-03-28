import React from "react";
import "./CardFlip.css";

function CollectieItem(props) {
    return(
        <div class="mt-8 w-96">
            <div class="card h-96 w-96">
                <div class="inner relative">
                    <div class="front absolute">
                        <img class="object-fill h-96 w-96 border-4 border-blauw rounded-2xl" src={props.image} alt=""/>
                    </div>
                    <div class="back absolute bg-blauw text-white w-96 h-96 rounded-2xl text-center text-xl p-16">
                        <h1>Dit is een geweldig shirt gemaakt van een prachtige stof. Perfect voor de trainingen en de wedstrijden.</h1>
                    </div>
                </div>
            </div>
            <h1 class="text-blauw text-3xl font-medium">{props.title}</h1>
            <h1 class="text-rood text-xl">{props.price}</h1>
        </div>
    )
}

export default CollectieItem;