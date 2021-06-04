import React from "react";
import Header from "../../../components/Header";
import image from "../../../images/placeholder.png";
import ContactButtons from "../../../components/ContactButtons";


function Meetrainen(props) {
    return (
        <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-8 lg:mb-24">
            <div class="lg:inline py-4 lg:py-0 lg:my-8 w-full lg:w-1/2">
                <Header text="Proeftrainen" position="left" />
                <p class="text-white text-md mx-4 lg:mx-16 mt-4 lg:mt-8">
                    {props.text.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                    )} 
                </p>
                <ContactButtons />
            </div>
            <img src={require(`../../../images/word_lid/${props.foto}`).default} alt="" class="lg:inline w-full lg:w-1/2" />
        </div>
    )
}
export default Meetrainen;
