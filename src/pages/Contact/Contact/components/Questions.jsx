import React from "react";
import Question from "./Question";
import "./Questions.scss";

function Questions(props) {
    return (
        <div id="question_grid">
            {props.questions.map(vraag => 
                <Question key={vraag.vraag} vraag={vraag.vraag} antwoord={vraag.antwoord}/>
            )}
        </div>
        
    )
}

export default Questions;