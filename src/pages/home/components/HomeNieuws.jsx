import React, { useEffect, useState } from "react";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import { Link } from "react-router";
import "./HomeNieuws.scss";
import Nieuws from "../../../content/Nieuws.json";
import nieuws from "$images/home/nieuws.jpg";

function HomeNieuws() {
  const [maxNieuws, setMaxNieuws] = useState(3);
  useEffect(() => {
    if (window.innerWidth <= 1023) {
      setMaxNieuws(1);
    }
  }, []);

  return (
    <div id="home_nieuws_container">
      <div id="home_nieuws_foto">
        <img id="home_nieuws_foto_2" src={nieuws} alt="" />
      </div>
      <div id="home_nieuws_info">
        {Nieuws.nieuwsberichten.slice(0, maxNieuws).map((item, index) => (
          <div
            key={"home_nieuws" + item.titel}
            className={"home_nieuwsbericht" + (index < 2 ? " home_border" : "")}
          >
            <div className="home_nieuwsitem">
              <h1 className="home_nieuwstitel">{item.titel}</h1>
              <h2 className="home_nieuwsstukje">{item.tekst}</h2>
            </div>
            <Link to={"/nieuws#" + item.id} className="no_underline">
              <h2 className="home_nieuws_link">Lees meer</h2>
            </Link>
          </div>
        ))}
      </div>
      <div id="home_nieuws_title">NIEUWS</div>
    </div>
  );
}

export default HomeNieuws;
