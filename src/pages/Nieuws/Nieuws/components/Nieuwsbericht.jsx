import React from "react";
import Title from "./Title";
import "./Nieuwsbericht.scss";
import {getNestedImagesUrl} from "../../../../functions/links";

function Nieuwsbericht(props) {
    return (
        <div id={props.id} className="nieuwsbericht_1">
            {(props.position === "left" || window.innerWidth <= 1023) ? (
                <img className="nieuwsbericht_2" src={getNestedImagesUrl(`${props.page}/${props.foto}`)} alt="" />
            ) : ""}
                <div className="nieuwsbericht_3">
                <Title title={props.titel.toUpperCase()} position={props.position} />
                <p className={"nieuwsbericht_4" + (props.position === "left" ? " textLeft" : " textRight")}>
                    {props.datum} | {props.auteur}
                </p>
                <p className="nieuwsbericht_5">
                    {props.tekst.split('\n').map((item, index) =>
                        <span key={props.id + index}>
                            {item}
                            <br />
                        </span>

                    )}
                </p>
            </div>
            {(props.position === "left" || window.innerWidth <= 1023) ? "" : (
                <img className="nieuwsbericht_6" src={getNestedImagesUrl(`${props.page}/${props.foto}`)} alt="" />)}
        </div>
    )
}

export default Nieuwsbericht;

