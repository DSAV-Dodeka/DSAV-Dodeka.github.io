import Question from "./Question";
import "./Questions.scss";

function Questions(props: { questions: { vraag: string; antwoord: string }[] }) {
    return (
        <div id="question_grid">
            {props.questions.map((vraag: { vraag: string; antwoord: string }) =>
                <Question key={vraag.vraag} vraag={vraag.vraag} antwoord={vraag.antwoord}/>
            )}
        </div>
        
    )
}

export default Questions;