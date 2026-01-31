import React from "react";
// import {
//   HashLink as Link
// } from "react-router-hash-link";
import {
    Link
} from "react-router";
import {getNestedImagesUrl} from "../../../functions/links";
import "./Samenwerkingen.scss";
import muconsult from "$images/sponsors/muconsult.png";
import maltha from "$images/sponsors/maltha.png";
import boozed from "$images/sponsors/boozed.png";
import virtuoos from "$images/sponsors/virtuoos.png";
import arnold from "$images/arnold/arnoldtrap.jpg";




function Homesamenwerking() {
  return (
    <div id="home_samenwerking_container">
        <div id="home_samenwerking_foto" >
            <img id="home_samenwerking_foto_2" src={arnold} alt=""/>
        </div>
        <div className="home_samenwerking_fotos">
            <a href="https://www.malthasport.nl/" target="_blank" rel="noopener noreferrer">
              <img src={maltha} alt="malta" className="sponsors maltha" />
            </a>
            <a href="https://muconsult.nl/" target="_blank" rel="noopener noreferrer">
              <img src={muconsult} alt="muconsult" className="sponsors maltha" />
            </a>
            <a href="https://www.boozed.nl/" target="_blank" rel="noopener noreferrer">
              <img src={boozed} alt="boozed" className="sponsors maltha" />
            </a>
            <a href="https://www.virtuoos.com/" target="_blank" rel="noopener noreferrer">
              <img src={virtuoos} alt="virtuoos" className="sponsors virtuoos" />
            </a>
        </div>

        <div id="home_samenwerking_title"
         className="absolute lg:right-0 top-8 w-3/4 bg-rood h-16 text-white text-3xl font-bold pl-8 lg:pl-16 pt-3">SAMENWERKINGEN</div>
    </div>
  );
}

export default Homesamenwerking;