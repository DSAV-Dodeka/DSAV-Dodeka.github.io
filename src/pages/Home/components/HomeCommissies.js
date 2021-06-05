import React from "react";
import {
    Link
} from "react-router-dom";
import "./HomeCommissies.css";
import foto from "../../../images/trainingen/baanatletiek.jpg";

function HomeCommissies() {
  return (
    <div class="w-full relative h-96 mt-24">
        <div class="absolute commissiefoto left-0 w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full" src={foto} alt=""/>

        </div>
        <div class="absolute commissieinfo w-3/4 right-0 bg-blauw bg-opacity-90 h-96 pl-40 pr-16">
            

        </div>
        <div class="absolute right-0 top-8 w-3/4 bg-rood h-16 text-white text-3xl font-bold pl-16 pt-3">COMMISSIES</div>
    </div>
  );
}

export default HomeCommissies;