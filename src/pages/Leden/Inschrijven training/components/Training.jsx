import "./Training.scss";
import { useContext, useState } from "react";

function Training(props){
    return (
        <div className="training_inschrijven">
            {props.cancelled === "" ? 
                (props.active ?
                    <>
                        <p className="training_datum">{props.date_time}</p>
                        <div className="training_active_inschrijvers">
                            {props.events.map((item) =>
                                <div className="training_active_signup">
                                    <p className="training_active_onderdeel">{item}</p>
                                    <p className="training_active_ingeschreven">Allemaal namen</p>
                                    <button className="training_active_submit">Schrijf je in</button>
                                </div>
                            )}
                            <svg className="arrowUpTraining trainingCursor" onClick={() => props.setActive(props.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"/></svg>
                        </div>
                    
                    </>
                :
                    <>
                        <p className="training_datum">{props.date_time}</p>
                        <p className="training_onderdelen">Onderdelen: {props.events.toString().replaceAll(",", ", ")}</p>
                        <p className="training_inschrijvers">{props.signed_up.length} inschrijvingen</p>
                        <svg className="arrowDownTraining trainingCursor" onClick={() => props.setActive(props.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>
                    </>
                )
            :
                <>
                    <p className="training_datum doorgestreept">{props.date_time}</p>
                    <p className="training_cancelled">De training gaat niet door vanwege {props.cancelled}</p>
                </>
            }
        </div>
    );
}

export default Training;
