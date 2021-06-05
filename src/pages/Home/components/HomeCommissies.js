import React from "react";
import {
    Link
} from "react-router-dom";
import "./HomeCommissies.css";
import foto from "../../../images/home/commissie.png";

function HomeCommissies() {
  return (
    <div class="w-full relative h-96 mt-24 mb-24">
        <div class="absolute commissiefoto left-0 w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full" src={foto} alt=""/>

        </div>
        <div class="absolute commissieinfo w-3/4 right-0 bg-blauw bg-opacity-90 h-96 pl-40 pr-16 pt-32 text-white">
            D.S.A.V. Dodeka wordt voor en door studenten gerund. Er zijn een flink aantal commissies, waaronder de activiteiten commissie (SAX) of de Nieuwsbrief commissie (RedaCie). Ben je benieuwd naar welke commissies er nog meer op de vereniging bestaan, neem dan eens een kijkje op de <Link to="/over/commissies" class="text-rood"><b>commissie pagina</b></Link> !

        </div>
        <div class="absolute right-0 top-8 w-3/4 bg-rood h-16 text-white text-3xl font-bold pl-16 pt-3">COMMISSIES</div>
    </div>
  );
}

export default HomeCommissies;