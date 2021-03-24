import React from "react";

function Contactinfo() {
    return (
        <div class="flex w-full mx-16">
            <div class="inline w-1/3 space-y-8"> 
                <h1 class="text-white text-3xl font-bold">Telefoon:</h1>
                <h1 class="text-white text-3xl font-bold">E-mail:</h1>
                <h1 class="text-white text-3xl font-bold">Adres:</h1>
                <h1 class="text-white text-3xl font-bold">AV`40 Website:</h1>
            </div>
            <div class="inline w-1/2 space-y-8">
                <h1 class="text-rood text-3xl font-bold">Nummer</h1>
                <div><a href="mailto:studentenatletiek@av40.nl" class="text-rood text-3xl font-bold">studentenatletiek@av40.nl</a></div>
                <h1 class="text-rood text-3xl font-bold">Sportring 12, 2616LK Delft</h1>
                <div><a target="_blank" rel="noreferrer" href="https://www.av40.nl" class="text-rood text-3xl font-bold">www.av40.nl</a></div>
            </div>
        </div>
    )
}

export default Contactinfo;