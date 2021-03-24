import React from "react";
import PageTitle from "../../components/PageTitle";
import Contactinfo from "./components/Contactinfo";
import Socials from "./components/Socials"
import Maps from "../../components/Maps";


function Contact() {
    return (
        <div>
            <PageTitle title="Contact" />
            <div class="flex bg-blauw bg-opacity-90 w-full mb-16">
                <div class="inline my-8 w-1/2">
                    <Contactinfo />
                    <Socials />
                </div>
                <div class="inline w-1/2 px-16">
                    <Maps />    
                </div>
            </div>
        </div>
    )
}

export default Contact;