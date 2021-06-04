import React from "react";

function Question(props) {
    return (
        <div class=" bg-blauw bg-opacity-90 text-white rounded-xl text-lg lg:text-xl mb-8">
            <div class="w-full bg-rood rounded-t-xl py-2 px-8 font-bold">
                {props.vraag}
            </div>
            <div class="px-8 py-2 text-base lg:text-lg">
                {props.antwoord}
            </div>
        </div>
    )
}

export default Question;