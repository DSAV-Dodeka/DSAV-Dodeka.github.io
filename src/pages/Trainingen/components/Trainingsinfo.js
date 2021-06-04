import React from "react";
import Maps from "../../../components/Maps";
import ContactButtons from "../../../components/ContactButtons";

function Trainingsinfo(props) {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-8 lg:mb-24">
            <div class="lg:inline py-8 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <p class= "text-white text-md px-4 lg:px-0 lg:mx-16 ">
                    {props.text.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                    )}  
                </p>
                <ContactButtons />
            </div>
            <div class="lg:inline w-full lg:w-1/2 h-96 lg:h-auto">
                <Maps />    
            </div>
        </div>
    )
}
export default Trainingsinfo;