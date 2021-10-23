import React from "react";
import PageTitle from "../../components/PageTitle";
import Contactinfo from "./components/Contactinfo";
import Socials from "./components/Socials"
import Maps from "../../components/Maps";
import Questions from "./components/Questions";
import Text from "../../content/FAQ.json";


function Contact() {
    return (
        <div>
            <PageTitle title="Contact" />
            <div class="lg:flex bg-blauw bg-opacity-90 w-full mb-8 lg:mb-16">
                <div class="w-full lg:inline py-4 lg:my-8 lg:py-0 lg:w-1/2">
                    <Contactinfo />
                    <Socials />
                </div>
                <div class="w-full h-96 lg:h-auto lg:inline lg:w-1/2">
                    <Maps />    
                </div>
            </div>
            <div id="faq">
                <PageTitle title="Frequently asked questions" />
            </div>
            <Questions questions={Text.questions} />
        </div>
    )
}

export default Contact;