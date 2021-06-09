import React from "react";
import Question from "./Question";

function Questions(props) {
    return (
        <div class="grid grid-cols-1 lg:grid-cols-2 mx-4 lg:mx-16 gap-x-8 mt-8 lg:mt-16 mb-8 lg:mb-24">
            {props.questions.map(vraag => 
                (vraag.vraag === "Wie is de leukste mascotte?" ?  <a href="https://www.instagram.com/arnold_dodeka/?hl=en" target="_blank" rel="noreferrer"><Question vraag={vraag.vraag} antwoord={vraag.antwoord}/></a> : <Question vraag={vraag.vraag} antwoord={vraag.antwoord}/>)
            )}
        </div>
        
    )
}

export default Questions;