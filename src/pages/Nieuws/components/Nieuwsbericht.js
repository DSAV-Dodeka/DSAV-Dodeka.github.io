import React from "react";
import Title from "./Title";
import "./Nieuwsbericht.scss";

function Nieuwsbericht(props) {
    return (
        <div id={props.id} class="nieuwsbericht_1">
            {(props.position === "left" || window.innerWidth <= 1023) ? (
                <img class="nieuwsbericht_2" src={require(`../../../images/${props.page}/${props.foto}`).default} alt="" />
            ) : ""}
                <div class="nieuwsbericht_3">
                <Title title={props.titel.toUpperCase()} position={props.position} />
                <p class={"nieuwsbericht_4" + (props.position === "left" ? " textLeft" : " textRight")}>
                    {props.datum} | {props.auteur}
                </p>
                <p class="nieuwsbericht_5">
                    {props.tekst.split('\n').map(item =>
                        <span>
                            {item}
                            <br />
                        </span>

                    )}
                </p>
            </div>
            {(props.position === "left" || window.innerWidth <= 1023) ? "" : (
                <img class="nieuwsbericht_6" src={require(`../../../images/${props.page}/${props.foto}`).default} alt="" />)}
        </div>
    )
}

export default Nieuwsbericht;

