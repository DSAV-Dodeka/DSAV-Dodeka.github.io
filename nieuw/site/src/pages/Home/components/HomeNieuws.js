import React from "react";
import {
    HashLink as Link
} from "react-router-hash-link";
import "./HomeNieuws.scss";
import foto from "../../../images/home/nieuws.jpg";
import Nieuws from "../../../content/Nieuws.json";

function HomeNieuws() {
    let maxNieuws = 3;
    if (window.innerWidth <= 1023) maxNieuws = 1; 
  return (
    <div id="home_nieuws_container">
        <div id="home_nieuws_foto">
            <img id="home_nieuws_foto_2" src={foto} alt=""/>

        </div>
        <div id="home_nieuws_info">
            {Nieuws.nieuwsberichten.slice(0, maxNieuws).map((item, index) =>
                    <div class={"home_nieuwsbericht" + (index < 2 ? " home_border" : "")}> 
                        <div class="home_nieuwsitem">
                            <h1 class="home_nieuwstitel">{item.titel}</h1>
                            <h2 class="home_nieuwsstukje">{item.tekst}</h2>
                        </div>
                        <Link to={"/nieuws#" + item.id} class="no_underline"><h2 class="home_nieuws_link">Lees meer</h2></Link>
                    </div>
                )}

        </div>
        <div id="home_nieuws_title">NIEUWS</div>
    </div>
  );
}

export default HomeNieuws;
