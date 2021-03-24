import React from "react";

function Trainingstijden() {
    return(
        <div class="flex mx-16">
            <div class="inline bg-rood text-center text-white text-xl font-bold rounded-t-lg py-2 w-40">
                <h1>MAANDAG</h1>
                <h1>18:00-19:30</h1>
            </div>
            <div class="inline flex items-center justify-center text-center text-rood text-xl font-bold rounded-t-lg p-2 flex-grow"> 
                <h1>DINSDAG</h1>
            </div>
            <div class="inline bg-rood text-center text-white text-xl font-bold rounded-t-lg py-2 w-40">
                <h1>WOENSDAG</h1>
                <h1>18:15-19:45</h1>
            </div>
            <div class="inline flex items-center justify-center text-center text-rood text-xl font-bold rounded-t-lg p-2 flex-grow"> 
                <h1>DONDERDAG</h1>
            </div>
            <div class="inline flex items-center justify-center text-center text-rood text-xl font-bold rounded-t-lg p-2 flex-grow"> 
                <h1>VRIJDAG</h1>
            </div>
            <div class="inline bg-rood text-center text-white text-xl font-bold rounded-t-lg py-2 w-40">
                <h1>ZATERDAG</h1>
                <h1>10:45-12:15</h1>
            </div>
            <div class="inline flex items-center justify-center text-center text-rood text-xl font-bold rounded-t-lg p-2 flex-grow"> 
                <h1>ZONDAG</h1>
            </div>
        </div>
    )
}

export default Trainingstijden;