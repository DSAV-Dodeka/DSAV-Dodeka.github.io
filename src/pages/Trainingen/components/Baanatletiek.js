import React from "react";
import Header from "../../../components/Header";
import "./Baanatletiek.scss"

function Baanatletiek(props) {
    return(
        <div class="baanatletiek_1">
            <img src={require(`../../../images/trainingen/${props.foto}`).default} alt="" class="baanatletiek_2" />
            <div class="baanatletiek_3">
                <Header text="Baanatletiek" position="left"/>
                <p class="baanatletiek_4">
                    {props.text.split('\n').map(item =>
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
export default Baanatletiek;