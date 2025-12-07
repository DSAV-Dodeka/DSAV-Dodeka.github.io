import React, { useEffect, useState } from "react";
import Title from "./Title";
import "./Nieuwsbericht.scss";
import { getHashedImageUrl } from "$functions/links";

function Nieuwsbericht(props) {
  const [width, setWidth] = useState(1920);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return (
    <div id={props.id} className="nieuwsbericht_1">
      {props.position === "left" || width <= 1023 ? (
        <img
          className="nieuwsbericht_2"
          src={getHashedImageUrl(`/${props.page}/${props.foto}`)}
          alt=""
        />
      ) : (
        ""
      )}
      <div className="nieuwsbericht_3">
        <Title title={props.titel.toUpperCase()} position={props.position} />
        <p
          className={
            "nieuwsbericht_4" +
            (props.position === "left" ? " textLeft" : " textRight")
          }
        >
          {props.datum} | {props.auteur}
        </p>
        <p className="nieuwsbericht_5">
          {props.tekst.split("\n").map((item, index) => (
            <span key={props.id + index}>
              {item}
              <br />
            </span>
          ))}
        </p>
      </div>
      {props.position === "left" || width <= 1023 ? (
        ""
      ) : (
        <img
          className="nieuwsbericht_6"
          src={getHashedImageUrl(`/${props.page}/${props.foto}`)}
          alt=""
        />
      )}
    </div>
  );
}

export default Nieuwsbericht;
