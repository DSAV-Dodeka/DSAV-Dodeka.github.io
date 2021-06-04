import React from "react";
import Header from "../../../components/Header";

function Contributie(props) {
    return(
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-16 lg:mb-24">
            <img src={require(`../../../images/word_lid/${props.foto}`).default} alt="" class="lg:inline w-full lg:w-1/2" />
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Contributie" position="right"/>
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
export default Contributie;
