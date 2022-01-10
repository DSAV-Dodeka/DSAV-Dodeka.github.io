import React from "react";
import Maps from "../../../components/Maps";
import ContactButtons from "../../../components/ContactButtons";
import "./Trainingsinfo.scss";

function Trainingsinfo(props) {
    return(
        <div class="trainingsinfo_1">
            <div class="trainingsinfo_2">
                <p class= "trainingsinfo_3">
                    {props.text.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                    )}  
                </p>
                <ContactButtons />
            </div>
            <div class="trainingsinfo_4">
                <Maps />    
            </div>
        </div>
    )
}
export default Trainingsinfo;