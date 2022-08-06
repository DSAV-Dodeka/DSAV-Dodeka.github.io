import React from "react";
import "./Record.scss";

function Record(props) {
    return(
        <div className="record" onClick={props.onClick}>
            {props.active ? 
            <div className="activeRecord">
                <div className="onderdeelRecord">
                    <p>{props.onderdeel.toUpperCase()}</p>
                </div>
                <div className="onderdeelPrestaties">
                    <div className="prestatieLeeg" />
                    {
                        props.prestaties.map((prestatie, index) =>
                            <div className="prestatie">
                                <p>{index + 1 + ". " + prestatie.naam}</p>
                                <p>{prestatie.prestatie}</p>
                                <p>{prestatie.datum + " " + prestatie.plaats}</p>
                            </div>
                        )
                    }
                </div>
            </div>
            :
            <div className="inactiveRecord">
                <p>{props.onderdeel.toUpperCase()}</p>
                <p>{props.prestaties[0].naam}</p>
                <p>{props.prestaties[0].prestatie}</p>
            </div>
            }
        </div>
    )
}

export default Record;