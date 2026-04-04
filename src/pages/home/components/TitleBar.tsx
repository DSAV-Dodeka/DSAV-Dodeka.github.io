import { Link } from "react-router";
import "./TitleBar.scss";
import D from "../../../images/groteD.svg?react";
import Sneeuw from "../../../images/home/grass.svg?react";
import titlebar from "$images/home/titlebar.webp";

function TitleBar() {
  return (
    <div id="home_title_container">
      <div id="home_title_left">
        <div className="sneeuw_wrapper">
          <Sneeuw className="sneeuw_bar" style={{ left: '-5%' }} />
          <Sneeuw className="sneeuw_bar" style={{ left: '25%', transform: 'none' }} />
          <Sneeuw className="sneeuw_bar" style={{ left: '55%' }} />
        </div>
      </div>
      <div id="home_title_right">
        <img id="home_title_background" src={titlebar} alt="" />
      </div>
      <div id="home_title_right_over">
        <div id="home_title_right_pos">
          <h1 id="home_title_right_text">
            Dé Delftse Studenten <br />
            Atletiek Vereniging!
          </h1>
          <Link to="/word_lid">
            <button id="home_title_right_button">Train 3x gratis mee!</button>
          </Link>
          <D id="home_title_d"></D>
        </div>
      </div>
    </div>
  );
}

export default TitleBar;
