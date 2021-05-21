import React from "react";
import Foto from "./Foto";
import Title from "./Title"
import logo from "../../../images/nieuwsPagina.png";

function Nieuwsbericht(props) {
    return(
        <div class="pt-8 mb-24 relative">
            <Foto image={logo} position={props.position}/>
            <div class="w-full py-8 bg-blauw bg-opacity-90">
                <Title title={props.titel.toUpperCase()} position={props.position}/>
                <p class={"my-4 px-16 text-white" + (props.position === "left" ? " text-left" : " text-right")}>
                    {props.datum} | {props.auteur}
                </p>
                <p class="my-8 px-16 text-white text-left">
                    {props.tekst.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                        
                    )}    
                </p>    
            </div> 
        </div>   
    )
}

export default Nieuwsbericht;

