import React from "react";
import "./Record.scss";

function Record(props) {
    return(
        <div className="record">
            {props.active ? 
            <div className="activeRecord">
                <div className="onderdeelRecord recordCursor" onClick={props.onClick}>
                    <p>{props.onderdeel.toUpperCase()}</p>
                </div>
                <div className="onderdeelPrestaties">
                    <div className="prestatieLeeg" />
                    {
                        props.prestaties.length > 0 ? props.prestaties.map((prestatie, index) =>
                            <div className="prestatie">
                                <p className="prestatieNaam">{index + 1 + ". " + prestatie.naam}</p>
                                <p className="prestatieTijd">{prestatie.prestatie}</p>
                                <p className="pcOnly prestatieDatum">{prestatie.datum + " " + prestatie.plaats}</p>
                            </div>
                        ) : ""
                    }
                    <svg className="arrowUp recordCursor" onClick={props.onClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"/></svg>
                </div>
            </div>
            :
            <div className={"inactiveRecord" + (props.prestaties.length > 1 ? " recordCursor": "")} onClick={props.onClick}>
                <p className="onderdeelMobile">{props.onderdeel.toUpperCase()}</p>
                <p className="pcOnly">{props.prestaties.length > 0 ? props.prestaties[0].naam  : "Vacant"}</p>
                <p className="pcOnly">{props.prestaties.length > 0 ? props.prestaties[0].prestatie : ""}</p>
                {props.prestaties.length > 1 ? <svg className="arrowDown pcOnly" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg> : ""}
                <div className="inactiveRecordMobile">
                    <p className="growMobile">{props.prestaties.length > 0 ? props.prestaties[0].naam  : "Vacant"}</p>
                    <p>{props.prestaties.length > 0 ? props.prestaties[0].prestatie : ""}</p>
                    {props.prestaties.length > 1 ? <svg className="arrowDown" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg> : ""}
                </div>
            </div>
            }
        </div>
    )
}

export default Record;