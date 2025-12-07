import React from "react";
import parse from "html-react-parser";
import "./WedstrijdAlgemeen.scss";
import { getNestedImagesUrl } from "../../../../functions/links";

function Wedstrijd(props) {
  return (
    <div className="wedstrijd_algemeen">
      <img
        className="wedstrijd_algemeen_foto"
        alt=""
        src={getNestedImagesUrl(`wedstrijden/${props.wedstrijd.foto}`)}
      />
      <p className="wedstrijd_algemeen_info">
        {parse(props.wedstrijd.info_lang)}
      </p>
      {"uitslagen" in props.wedstrijd && props.wedstrijd.uitslagen ? (
        <a
          target="_blank"
          rel="noreferrer"
          href={props.wedstrijd.uitslagen}
          className="inschrijf_button"
        >
          Uitslagen
        </a>
      ) : "inschrijven" in props.wedstrijd && props.wedstrijd.inschrijven ? (
        <a
          target="_blank"
          rel="noreferrer"
          href={props.wedstrijd.inschrijven}
          className="inschrijf_button"
        >
          Inschrijven
        </a>
      ) : (
        ""
      )}
    </div>
  );
}

export default Wedstrijd;
