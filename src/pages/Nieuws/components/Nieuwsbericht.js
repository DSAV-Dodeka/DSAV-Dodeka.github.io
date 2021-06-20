import React from "react";
import Title from "./Title";

function Nieuwsbericht(props) {
    return (
        <div class="relative lg:flex">
            <img class={"w-full lg:w-1/3 object-cover" + (props.position === "right" ? " lg:hidden": "")} src={require(`../../../images/${props.page}/${props.foto}`).default} alt=""/>
            <div class="w-full lg:w-2/3 py-4 lg:py-8 bg-blauw bg-opacity-90">
                <Title title={props.titel.toUpperCase()} position={props.position} />
                <p class={"my-4 px-4 lg:px-16 text-white" + (props.position === "left" ? " text-left" : " text-right")}>
                    {props.datum} | {props.auteur}
                </p>
                <p class="my-4 lg:my-8 px-4 lg:px-16 text-white text-left text-base">
                    {props.tekst.split('\n').map(item =>
                        <span>
                            {item}
                            <br />
                        </span>

                    )}
                </p>
            </div>
            {props.position === "right" ? (
                <img class="w-full lg:w-1/3 object-cover hidden lg:block" src={require(`../../../images/${props.page}/${props.foto}`).default} alt="" />) : ""}
        </div>
    )
}

export default Nieuwsbericht;

