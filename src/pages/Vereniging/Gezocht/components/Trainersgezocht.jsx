import React from "react";
import Header from "../../../../components/Header";
import "./Trainersgezocht.scss";
import { getNestedImagesUrl } from "../../../../functions/links";
import ContactButtons from "../../../../components/ContactButtons";

function Trainersgezocht(props) {
  return (
    <div className="gezocht_1">
      <div className="gezocht_2">
        <Header text="Wij zoeken jou!" position="right" />
        <p className="gezocht_3">
          {props.text.split("\n").map((item, index) => (
            <span key={"gezocht" + index}>
              {item}
              <br />
            </span>
          ))}
        </p>
        <ContactButtons />
      </div>
      <img
        src={getNestedImagesUrl(`trainingen/${props.foto}`)}
        alt=""
        className="gezocht_4"
      />
    </div>
  );
}
export default Trainersgezocht;
