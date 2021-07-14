import React from "react";
import {
    HashLink as Link
} from "react-router-hash-link";
import "./HomeCommissies.css";
import foto from "../../../images/home/commissie.jpg";

function HomeCommissies() {
  return (
    <div class="w-full relative lg:h-96 mt-8 lg:mt-24 mb-8 lg:mb-24">
        <div class="lg:absolute commissiefoto left-0 w-full lg:w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full object-cover" src={foto} alt=""/>

        </div>
        <div class="lg:absolute commissieinfo w-full lg:w-3/4 right-0 bg-blauw bg-opacity-90 lg:h-96 p-2 lg:p-0 lg:pl-40 lg:pr-16 lg:pt-32 text-white">
            D.S.A.V. Dodeka wordt voor en door studenten gerund. Er zijn een flink aantal commissies, waaronder de activiteiten commissie (SAX) of de Nieuwsbrief commissie (RedaCie). Ben je benieuwd naar welke commissies er nog meer op de vereniging bestaan, neem dan eens een kijkje op de <Link to="/vereniging/commissies#" class="text-rood"><b>commissiepagina</b></Link>!

        </div>
        <div class="absolute lg:right-0 top-8 w-3/4 bg-rood h-16 text-white text-3xl font-bold pl-8 lg:pl-16 pt-3">COMMISSIES</div>
    </div>
  );
}

export default HomeCommissies;