import React from "react";
import Heading from "./Heading";

function ContactBar() {
    return (
        <div class="w-full lg:flex bg-blauw bg-opacity-90 overflow-x-hidden">
            <div class="lg:inline w-full py-4 lg:py-8">
                <Heading title="Contact informatie" />
                <div class="pt-4 px-4 text-white lg:text-center">
                    <p>Email: studentenatletiek@av40.nl</p>
                    <p>Adres: Sportring 12, Delft</p>
                </div>
            </div>
            <div class="lg:inline w-full py-4 lg:py-8">
                <Heading title="Trainingsdagen" />
                <div class="pt-4 px-4 text-white lg:text-center">
                    <p>Maandag 18:00-19:30</p>
                    <p>Woensdag 18:15-19:45</p>
                    <p>Zaterdag 10:15-11:45</p>
                </div>
            </div>
            <div class="lg:inline w-full py-4 lg:py-8">
                <Heading title="Sponsoren" />
                <div class="pt-4 px-4 text-white lg:text-center">
                    <p>Rice & Pasta</p>
                    <p>Maltha Sport</p>
                </div>
            </div>

        </div>
    )
}

export default ContactBar;