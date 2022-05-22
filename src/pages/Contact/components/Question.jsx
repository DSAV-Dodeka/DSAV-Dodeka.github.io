import React from "react";
import "./Question.scss";

function Question(props) {
    return (
        <div id="question_box">
            <div id="question">
                {props.vraag.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                    )} 
            </div>
            <div id="answer">
                {props.antwoord.split('\n').map(item =>
                        <span>
                            {item}
                            <br/>
                        </span>
                    )} 
            </div>
        </div>
    )
}

export default Question;