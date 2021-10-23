import React from "react";
import Header from "../../../components/Header";

function Baanatletiek(props) {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full">
            <img src={require(`../../../images/trainingen/${props.foto}`).default} alt="" class="lg:inline w-full lg:w-1/2" />
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Baanatletiek" position="left"/>
                <p class="text-white text-md mx-4 lg:mx-16 mt-4 lg:mt-8">
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