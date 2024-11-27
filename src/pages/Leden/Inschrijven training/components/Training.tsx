import "./Training.scss";
import React, { useContext, useState } from "react";

import AddIcon from "../../../../images/leden/AddIcon.svg?react";
import RemoveIcon from "../../../../images/leden/RemoveIcon.svg?react";

interface TrainingProps {
    id: string
    date_time: string
    cancelled: string,
    events: string[],
    signed_up: string[],
    active: boolean,
    setActive: (training_id: string) => void,
    editModeActive: boolean
}

function Training(props: TrainingProps) {
    function makeActive() {
        if (!props.active && !props.cancelled) {
            props.setActive(props.id)
            setOnderdeelActive("")
        }
    }

    const [onderdeelActive, setOnderdeelActive] = useState("")

    const [onderdeelIngeschreven, setOnderdeelIngeschreven] = useState("")

    function switchOnderdeelActive (onderdeelNaam: React.SetStateAction<string>) {
        if (onderdeelActive === onderdeelNaam) {
            setOnderdeelActive("");
        }
        else { setOnderdeelActive(onderdeelNaam)}
    }

    function onderdeelInschrijven(onderdeelNaam: React.SetStateAction<string>) {
        if (onderdeelIngeschreven === onderdeelNaam) {
            setOnderdeelIngeschreven("");
        }
        else {
            setOnderdeelIngeschreven(onderdeelNaam);
        }
    }

    return (
        <div
            className={props.cancelled === "" ? (props.active ? "TrainingItem TrainingItem_active" : "TrainingItem TrainingItem_closed shadow-on-hover") : "TrainingItem TrainingItem_cancelled"}
            onClick={makeActive}
        >
            <div className="training_datum_container">
                <p className="training_datum">{props.date_time}</p>
            </div>
            <div className="training_info_container">
                <div className="training_data_closed">
                    <p className="training_onderdelen"><b className="training_onderdelen_long">Onderdelen: </b>{props.events.toString().replaceAll(",", ", ")}</p>
                    <p className="training_inschrijvers_kort">{props.signed_up.length} inschrijvingen</p>
                </div>
                <div className="training_data_active">
                    {props.events.map((item) =>
                        <div className={onderdeelActive === item ? "training_onderdeel training_onderdeel_active" : "training_onderdeel training_onderdeel_closed"}>
                            <div className="training_onderdeel_basicinfo">
                                <RemoveIcon id="training_onderdeel_remove_button" className="training-meta-button-small"></RemoveIcon>
                                <svg className="arrowOnderdeel arrowUpOnderdeel trainingCursor" onClick={() => setOnderdeelActive("")} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" /></svg>
                                <svg className="arrowOnderdeel arrowDownOnderdeel trainingCursor" onClick={() => setOnderdeelActive(item)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" /></svg>
                                <div className="training_onderdeel_naam" onClick={() => switchOnderdeelActive(item)}>
                                    <p>{item}</p>
                                    <input className="editItemText" type="text" id="edit_onderdeel_naam" name="Onderdeel Naam" value={item}/>
                                </div>
                                <button className={onderdeelIngeschreven === item ? "training_onderdeel_inschrijfbutton training_onderdeel_inschrijfbutton_ingeschreven" : "training_onderdeel_inschrijfbutton" + ( !props.editModeActive ? " shadow-on-hover" : "")}
                                    onClick={() => !props.editModeActive ? onderdeelInschrijven(item) : null }>
                                    {onderdeelIngeschreven === item ? "Uitschrijven" : "Schrijf je in"}
                                </button>
                            </div>
                            <p className="training_onderdeel_inschrijvers">James, Robert, John, Michael, David, William, Richard, Joseph, Thomas, Christopher, Charles, Daniel, Matthew, Anthony, Mark, Donald, Steven, Andrew, Paul, Joshua, Mary, Patricia, Jennifer, Linda, Elizabeth, Barbara, Susan, Jessica, Sarah, Karen, Lisa, Nancy, Betty, Sandra, Margaret, Ashley, Kimberly, Emily, Donna, Michelle</p>
                        </div>
                    )}
                </div>
                <AddIcon id="training_onderdeel_add_button" className="training-meta-button-small"></AddIcon>
                <p className="training_data_cancelled">De training gaat niet door vanwege {props.cancelled}</p>
            </div>
        </div>
    );
}

export default Training;
