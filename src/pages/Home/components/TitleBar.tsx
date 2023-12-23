import React from "react";
import {
  Link
} from "react-router-dom";
import "./TitleBar.scss";
import D from "../../../images/groteD.svg?react";
import getUrl from "../../../functions/links";
import Sneeuw from "../../../images/home/sneeuw.svg?react";


function TitleBar() {  
  return (
    <div id="home_title_container">
        <div id="home_title_left" >
          <Sneeuw className="sneeuw_bar"/>
        </div>
        <div id="home_title_right">
            <img id="home_title_background" src={getUrl("home/titlebar.jpg")} alt=""/>

        </div>
        <div id="home_title_right_over">
            <div id="home_title_right_pos">
                <h1 id="home_title_right_text">Dé Delftse Studenten <br/>Atletiek Vereniging!</h1>
                <Link to="/word_lid"><button id="home_title_right_button">Train 3x gratis mee!</button></Link>
                <D id="home_title_d"></D>
            </div>
            

        </div>
    </div>
  );
}

export default TitleBar;
