import React from "react";

function Info() {
    return(
        <div class="flex justify-between pt-4 px-16 w-full text-white">
            <div class="w-64 inline text-left">
                <p>Email: info@dsav40.nl</p>
                <p>Adres: Sportring 12, Delft</p>
                <p>Telefoon: nummer</p>
            </div>
            <div class="w-64 inline text-center">
                <p>Maandag 18:00-19:30</p>
                <p>Woensdag 18:15-19:45</p>
                <p>Zondag 10:30-12:00</p>
            </div>
            <div class="w-64 inline text-right">
                <p>Rice & Pasta</p>
                <p>Maltha Sport</p>
                <p>Hopelijk meer binnenkort</p>
            </div>
        </div>
    )
}

export default Info;