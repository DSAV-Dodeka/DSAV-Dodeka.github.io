import React from "react";

function Contactinfo() {
    return (
        <div class="w-3/4 mx-4 lg:grid lg:grid-cols-2 lg:mx-16 lg:gap-y-8">
            <h1 class="text-white text-xl lg:text-2xl font-bold">E-mail</h1>
            <div><a href="mailto:bestuurk@dsavdodeka.nl" class="text-rood text-xl lg:text-2xl font-bold">bestuur@dsavdodeka.nl</a></div>
            <h1 class="text-white text-xl lg:text-2xl font-bold">Adres</h1>
            <h1 class="text-rood text-xl lg:text-2xl font-bold">Sportring 12, <br></br> 2616LK Delft</h1>
            <h1 class="text-white text-xl lg:text-2xl font-bold">AV`40 Website</h1>
            <div><a target="_blank" rel="noreferrer" href="https://www.av40.nl" class="text-rood text-xl lg:text-2xl font-bold">www.av40.nl</a></div>

        </div>
    )
}

export default Contactinfo;