import React from "react";
import Header from "../../../components/Header";
import "./Baanatletiek.scss"

function Baanatletiek(props) {
    return(
        <div className="baanatletiek_1">
            <img src={require(`../../../images/trainingen/${props.foto}`).default} alt="" className="baanatletiek_2" />
            <div className="baanatletiek_3">
                <Header text="Baanatletiek" position="left"/>
                <p className="baanatletiek_4">
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