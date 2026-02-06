import { Link } from "react-router";
import "./ContactBar.scss";

import Heading from "./Heading";
import maltha from "$images/sponsors/maltha.png";
import muconsult from "$images/sponsors/muconsult.png";
import boozed from "$images/sponsors/boozed.png";
import virtuoos from "$images/sponsors/virtuoos.png";


function ContactBar() {
  return (
    <div id="contact_bar">
      <div className="bar_container">
        <Link className="no_underline" to="/contact">
          <Heading title="Contactinformatie" />
        </Link>
        <div className="bar_info">
          <p>
            Email:{" "}
            <a href="mailto:bestuur@dsavdodeka.nl" className="bar_link">
              bestuur@dsavdodeka.nl
            </a>
          </p>
          <p>
            Trainingslocatie:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.google.nl/maps/place/Delftse+Atletiekvereniging+1940/@52.0294071,4.3655958,17z/data=!3m1!4b1!4m5!3m4!1s0x47c5b60b0c9dbfa9:0x9fa03ef4a72f1db8!8m2!3d52.0294038!4d4.3677845"
              className="bar_link"
            >
              Sportring 12, Delft
            </a>
          </p>
          <Link to="/contact" className="bar_link">
            F.A.Q.
          </Link>
          <br />
          <a
            href="/files/privacyverklaring_dodeka_okt25.pdf"
            target="_blank"
            rel="noreferrer"
            className="privacy_link"
          >
            Privacyverklaring D.S.A.V. Dodeka
          </a>
        </div>
      </div>
      <div className="bar_container">
        <Link className="no_underline" to="/trainingen#">
          <Heading title="Trainingsdagen" />
        </Link>
        <div className="bar_info">
          <p>Maandag 18:15 - 19:45</p>
          <p>Woensdag 18:15 - 19:45</p>
          <p>Zaterdag 10:15 - 11:45</p>
        </div>
      </div>
      <div className="bar_container">
        <Link className="no_underline" to="/contact/sponsors#">
          <Heading title="Sponsors" />
        </Link>
        <div className="bar_info">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.malthasport.nl/"
          >
            <img
              src={maltha}
              alt="Maltha Sport"
              className="bar_sponsor maltha_bar"
            ></img>
          </a>
          <a target="_blank" rel="noreferrer" href="https://muconsult.nl/">
            <img
              src={muconsult}
              alt="MuConsult"
              className="bar_sponsor muconsult_bar"
            ></img>
          </a>
          <a target="_blank" rel="noreferrer" href="https://www.boozed.nl/">
            <img
              src={boozed}
              alt="Boozed"
              className="bar_sponsor boozed_bar"
            ></img>
          </a>
          <a target="_blank" rel="noreferrer" href="https://www.virtuoos.com/">
            <img
              src={virtuoos}
              alt="Virtuoos"
              className="bar_sponsor virtuoos_bar"
            ></img>
          </a>          
        </div>
      </div>
    </div>
  );
}

export default ContactBar;
