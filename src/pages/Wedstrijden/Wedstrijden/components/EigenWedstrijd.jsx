import React from "react";
import { Link } from "react-router";
import "./EigenWedstrijd.scss";
import {getStaticImageUrl} from "../../../../functions/links";

function EigenWedstrijd(props) {
  return (
    <div className={"eigenWedstrijd" + (props.oud ? " eigenWedstrijdOud" : "")}>
      <p className="eigenWedstrijdNaam">{props.naam}</p>
      <p
        className={
          "eigenWedstrijdDatum" + (props.oud ? " eigenWedstrijdDatumOud" : "")
        }
      >
        {props.datum}
      </p>
      <img
        className="eigenWedstrijdFoto"
        src={getStaticImageUrl(`wedstrijden/${props.logo}`)}
        alt=""
      />
      <p className="eigenWedstrijdInfo">{props.info_kort}</p>
      {props.path === "" ? (
        ""
      ) : (
        <Link to={"/wedstrijden" + props.path}>
          <h1
            className={
              "eigenWedstrijdLink" + (props.oud ? " eigenWedstrijdLinkOud" : "")
            }
          >
            Bekijk wedstrijd
          </h1>
        </Link>
      )}
    </div>
  );
}

export default EigenWedstrijd;
