import React from "react";
import "./HomeTrainingen.scss";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import {
    Link
} from "react-router-dom";
import getUrl from "../../../functions/links";

function HomeTrainingen() {
  return (
    <div id="home_trainingen_container">
        <div id="home_trainingen_foto">
            <img id="home_trainingen_foto_2" src={getUrl("home/trainingen.jpg")} alt=""/>

        </div>
        <div id="home_trainingen_info">
            De trainingen van Dodeka vinden plaats op maandag van 18:15 tot 19:45, op woensdag van 18:15 tot 19:45 en op zaterdag van 10:00 tot 11:30 op de atletiekbaan van AV'40 in Delft. Alle atletiekonderdelen, van sprint tot de marathon en van speerwerpen tot polsstokhoogspringen kunnen bij ons beoefend worden. Er trainen bij ons zowel beginnende atleten als mensen die meedoen aan NK's, dus de trainingen zijn geschikt voor elk niveau!
            <br></br>
            <br></br>
            <Link to="/trainingen#"><button id="home_trainingen_button">Lees meer!</button></Link>

        </div>
        <div id="home_trainingen_title">TRAININGEN</div>
    </div>
  );
}

export default HomeTrainingen;
