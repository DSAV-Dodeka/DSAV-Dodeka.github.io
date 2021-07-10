import React from "react";
import "./HomeTrainingen.css";
import foto from "../../../images/home/trainingen.jpg";
import {
  HashLink as Link
} from "react-router-hash-link";

function HomeTrainingen() {
  return (
    <div class="w-full relative lg:h-96 mt-8 lg:mt-24">
        <div id="trainfoto" class="lg:absolute right-0 w-full lg:w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full object-cover" src={foto} alt=""/>

        </div>
        <div id="traininfo" class="lg:absolute w-full lg:w-3/4 left-0 bg-blauw bg-opacity-90 lg:h-96 p-2 lg:p-0 lg:pl-16 lg:pr-40 lg:pt-32 text-white">
            De trainingen van D.S.A.V. Dodeka vinden plaats op maandag van 18:00 tot 19:30, op woensdag van 18:15 tot 19:45 en op zaterdag van 10:45 tot 12:15 op de atletiekbaan van AV`40 in Delft. Alle atletiekonderdelen, van sprint tot de marathon en van speerwerpen tot polsstokhoogspringen kunnen bij ons beoefend worden. Er trainen bij ons zowel beginnende atleten als mensen die meedoen aan NK's, dus de trainingen zijn geschikt voor elk niveau!
            <br></br>
            <br></br>
            <Link to="/trainingen#"><button class="bg-rood text-white text-xl font-bold rounded-xl p-2">Lees meer!</button></Link>

        </div>
        <div class="absolute left-0 top-8 w-3/4 bg-rood h-16 text-white lg:text-right text-3xl font-bold px-8 lg:x-16 pt-3">TRAININGEN</div>
    </div>
  );
}

export default HomeTrainingen;
