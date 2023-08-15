import React from "react";
import {
    Link
} from "react-router-dom";
import "./HomePromo.scss";

function HomePromo() {
  return (
    <Link to={"/owee"}>
        <div className="home_promo">
            <p>Van 13 tot en met 17 augustus zijn wij op de OWee. Bekijk hier al onze activiteiten!</p>
            <svg className="home_promo_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
        </div>
    </Link>
  );
}

export default HomePromo;
