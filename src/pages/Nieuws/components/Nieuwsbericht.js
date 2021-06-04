import React from "react";
import Title from "./Title";

function Nieuwsbericht(props) {
    return (
        <div class="relative flex">
            {props.position === "left" ? (
                <img class="w-1/3 object-cover" src={require(`../../../images/nieuws/${props.foto}`).default} alt=""/>) : ""}
            <div class="w-2/3 py-8 bg-blauw bg-opacity-90">
                <Title title={props.titel.toUpperCase()} position={props.position} />
                <p class={"my-4 px-16 text-white" + (props.position === "left" ? " text-left" : " text-right")}>
                    {props.datum} | {props.auteur}
                </p>
                <p class="my-8 px-16 text-white text-left">
                    {props.tekst.split('\n').map(item =>
                        <span>
                            {item}
                            <br />
                        </span>

                    )}
                </p>
            </div>
            {props.position === "right" ? (
                <img class="w-1/3 object-cover" src={require(`../../../images/nieuws/${props.foto}`).default} alt="" />) : ""}
        </div>
    )
}

export default Nieuwsbericht;

