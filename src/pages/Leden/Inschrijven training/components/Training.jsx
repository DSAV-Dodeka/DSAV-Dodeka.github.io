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
                                    <p className="training_active_ingeschreven">Random namen 1 2 3 4 5</p>
                                </div>
                            )}
                        </div>
                    
                    </>
                :
                    <>
                        <p className="training_datum">{props.date_time}</p>
                        <p className="training_onderdelen">Onderdelen: {props.events.toString().replaceAll(",", ", ")}</p>
                        <p className="training_inschrijvers">{props.signed_up.length} inschrijvingen</p>
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
