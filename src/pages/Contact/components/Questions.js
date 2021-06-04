import React from "react";
import Question from "./Question";

function Questions(props) {
    return (
        <div class="grid grid-cols-2 mx-16 gap-x-8 mt-16 mb-24">
            {props.questions.map(vraag => 
                <Question vraag={vraag.vraag} antwoord={vraag.antwoord}/>
            )}
        </div>
        
    )
}

export default Questions;