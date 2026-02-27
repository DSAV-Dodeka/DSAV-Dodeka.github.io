import "./Question.scss";

function Question(props: { vraag: string; antwoord: string }) {
    return (
        <div id="question_box">
            <div id="question">
                {props.vraag.split('\n').map((item: string) =>
                        <span key={item}>
                            {item}
                            <br/>
                        </span>
                    )} 
            </div>
            <div id="answer">
                {props.antwoord.split('\n').map((item: string) =>
                        <span key={item}>
                            {item}
                            <br/>
                        </span>
                    )} 
            </div>
        </div>
    )
}

export default Question;