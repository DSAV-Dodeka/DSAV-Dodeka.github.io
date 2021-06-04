import React from "react";
import "./HomeNieuws.css";
import foto from "../../../images/trainingen/baanatletiek.jpg";

function HomeNieuws() {
  return (
    <div class="w-full relative h-96 mt-24">
        <div class="absolute dia left-0 w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full" src={foto} alt=""/>

        </div>
        <div class="absolute diagonal w-3/4 right-0 bg-blauw bg-opacity-90 h-96 pl-40 pr-16">
            <div class="inline-block text-white w-1/3 align-top mt-28 h-64 border-r-2 border-white border-opacity-50">
                <h1 class="font-bold text-2xl mx-2">BESTE COMMISSIE GEKOZEN</h1>
                <h2 class="pt-4 mx-2">De beste commissie is uiteraard de .ComCom. De verkiezingen waren eigenlijk overbodig want de top 3 stond allang vast. Maar eerste is geworden de .ComCom, en er is een gedeelde tweede plaats voor de NSK Indoor commissie en de half-externe Batavierenrace commissie (zijn ze toch een keer 2e in plaats van 3e).</h2>
                <h2 class="pt-2 mx-2 text-right text-rood underline">Lees meer</h2>
            </div>
            <div class="inline-block text-white w-1/3 mt-28 h-64 border-r-2 border-white border-opacity-50">
            <h1 class="font-bold text-2xl mx-2">BESTE COMMISSIE GEKOZEN</h1>
                <h2 class="pt-4 mx-2">De beste commissie is uiteraard de .ComCom. De verkiezingen waren eigenlijk overbodig want de top 3 stond allang vast. Maar eerste is geworden de .ComCom, en er is een gedeelde tweede plaats voor de NSK Indoor commissie en de half-externe Batavierenrace commissie (zijn ze toch een keer 2e in plaats van 3e).</h2>
                <h2 class="pt-2 mx-2 text-right text-rood underline">Lees meer</h2>
            </div>
            <div class="inline-block w-1/3 text-white mt-28 h-64">
            <h1 class="font-bold text-2xl mx-2">BESTE COMMISSIE GEKOZEN</h1>
                <h2 class="pt-4 mx-2">De beste commissie is uiteraard de .ComCom. De verkiezingen waren eigenlijk overbodig want de top 3 stond allang vast. Maar eerste is geworden de .ComCom, en er is een gedeelde tweede plaats voor de NSK Indoor commissie en de half-externe Batavierenrace commissie (zijn ze toch een keer 2e in plaats van 3e).</h2>
                <h2 class="pt-2 mx-2 text-right text-rood underline">Lees meer</h2>
            </div>

        </div>
        <div class="absolute right-0 top-8 w-3/4 bg-rood h-16 text-white text-3xl font-bold pl-16 pt-3">LAATSTE NIEUWS</div>
    </div>
  );
}

export default HomeNieuws;
