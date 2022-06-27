import React from "react";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import {
    Link
} from "react-router-dom";
import "./HomeCommissies.scss";
import getUrl from "../../../functions/links";

function HomeCommissies() {
  return (
    <div id="home_commissies_container">
        <div id="home_commissies_foto" >
            <img id="home_commissies_foto_2" src={getUrl("home/commissie.jpg")} alt=""/>

        </div>
        <div id="home_commissies_info">
        Naast drie keer in de week sporten is er bij Dodeka ook meer dan genoeg tijd voor gezelligheid. Elke woensdag wordt na de training gezamenlijk gegeten en geborreld, en er worden vaak gezellige feestjes en andere activiteiten georganiseerd door onze vele commissies, waar je ook elk jaar deel van uit kunt maken. Ben je benieuwd naar welke commissies er nog meer op de vereniging bestaan, neem dan eens een kijkje op de <Link to="/vereniging/commissies#" id="home_commissies_link"><b>commissiepagina</b></Link>!

        </div>
        <div id="home_commissies_title" className="absolute lg:right-0 top-8 w-3/4 bg-rood h-16 text-white text-3xl font-bold pl-8 lg:pl-16 pt-3">GEZELLIGHEID</div>
    </div>
  );
}

export default HomeCommissies;