import React from "react";
import Header from "../../../components/Header";
import "./Loopgroep.scss"

function Loopgroep(props) {
    return(
        <div class="loopgroep_1">
            <div class="loopgroep_2">
                <Header text="Loopgroep" position="right"/>
                <p class="loopgroep_3">
                    {props.text.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                    )}  
                </p>
            </div> 
            <img src={require(`../../../images/trainingen/${props.foto}`).default} alt="" class="loopgroep_4" />
               
        </div>
    )
}
export default Loopgroep;