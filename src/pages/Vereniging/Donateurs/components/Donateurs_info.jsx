import React from "react";
import Header from "../../../../components/Header";
import "./Donateurs_info.scss"
import {getNestedImagesUrl} from "../../../../functions/links";
import ContactButtons from "../../../../components/ContactButtons";

function Trainersgezocht(props) {
    return(
        <div className="donateurs_1">
            <div className="donateurs_2">
                <Header text="Burger en geld over?" position="right"/>
                <p className="donateurs_3">
                    {props.text.split('\n').map((item, index) =>
                        <span key={"donateurs" + index}>
                            {item}
                            <br/>
                        </span>
                    )}  
                </p>
                <ContactButtons />
            </div> 
            <img src={getNestedImagesUrl(`contact/${props.foto}`)} alt="" className="donateurs_4" />
               
        </div>
    )
}
export default Donateurs;