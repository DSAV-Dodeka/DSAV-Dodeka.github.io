import React from "react";
import "./TitleBar.css";
import foto from "../../../images/home.jpg";
import logo from "../../../images/logo.png";

function TitleBar() {
  return (
    <div class="w-full relative h-96">
        <div class="absolute logo left-0 w-3/5 h-96 bg-blauw">
        <img class="w-2/3 ml-16" src={logo} alt=""/>

        </div>
        <div class="absolute signup w-1/2 right-0 h-96">
            <img class="h-full" src={foto} alt=""/>

        </div>
        <div class="absolute signup w-1/2 right-0 bg-white bg-opacity-50 h-96">
            <div id="pos" class="absolute top-1/2 space-y-8 transform -translate-x-1/2 -translate-y-1/2 text-center w-3/5">
                <h1 class="text-blauw text-3xl font-bold">Dé Delftse atletiekvereniging voor studenten!</h1>
                <button class="bg-rood text-white text-3xl font-bold rounded-xl p-4">Train 3x gratis mee!</button>
            </div>
            

        </div>
    </div>
  );
}

export default TitleBar;
