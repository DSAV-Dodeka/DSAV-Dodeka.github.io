import React from "react";
import "./HomeSponsors.css";
import foto from "../../../images/trainingen/baanatletiek.jpg";

function HomeSponsors() {
  return (
    <div class="w-full relative h-96 mt-24 mb-24">
        <div id="sponsorfoto" class="absolute right-0 w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full" src={foto} alt=""/>

        </div>
        <div id="sponsorinfo" class="absolute dia w-3/4 left-0 bg-blauw bg-opacity-90 h-96 pl-40 pr-16">
            

        </div>
        <div class="absolute left-0 top-8 w-3/4 bg-rood h-16 text-white text-right text-3xl font-bold px-16 pt-3">SPONSOREN</div>
    </div>
  );
}

export default HomeSponsors;
