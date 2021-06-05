import React from "react";
import "./HomeTrainingen.css";
import foto from "../../../images/home/trainingen.png";

function HomeTrainingen() {
  return (
    <div class="w-full relative h-96 mt-24">
        <div id="trainfoto" class="absolute right-0 w-1/3 h-96 bg-rood bg-opacity-60">
            <img class="w-full h-full" src={foto} alt=""/>

        </div>
        <div id="traininfo" class="absolute dia w-3/4 left-0 bg-blauw bg-opacity-90 h-96 pl-16 pr-40 pt-32 text-white">
            De trainingen van D.S.A.V. Dodeka vinden plaats op maandag van 18:00 tot 19:30, op woensdag van 18:15 tot 19:45 en op zaterdag van 10:45 tot 12:15 op de atletiekbaan van AV`40 in Delft. Alle atletiekonderdelen, van sprint tot de marathon en van speerwerpen tot polsstokhoogspringen kunnen bij ons beoefend worden. Er trainen bij ons zowel beginnende atleten als mensen die meedoen aan NK's, dus de trainingen zijn geschikt voor elk niveau!
            <br></br>
            <br></br>
            <br></br>
            <button className="bg-rood text-white text-xl font-bold rounded-xl p-2">Lees meer!</button>

        </div>
        <div class="absolute left-0 top-8 w-3/4 bg-rood h-16 text-white text-right text-3xl font-bold px-16 pt-3">TRAININGEN</div>
    </div>
  );
}

export default HomeTrainingen;
