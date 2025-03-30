import React, { FormEvent, useReducer } from "react";
import { formReducer, handleFormChange, handleSelectChange, handleRadioChange } from "../../../functions/forms";
import PageTitle from "../../../components/PageTitle";
import Onderdelen from "../../../content/Onderdelen.json";
import "./PR.scss";

interface PRState {
    soort: string;
    onderdeel: string;
    prestatie: string;
    datum: string;
    plaats: string;
    uitslagLink: string;
    isPR: boolean;
}

const initialState: PRState = {
    soort: "",
    onderdeel: "",
    prestatie: "",
    datum: "",
    plaats: "",
    uitslagLink: "",
    isPR: false,
};

const PR = () => {
    const [prState, dispatch] = useReducer(formReducer<PRState>, initialState);

    const submitPR = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", prState);
        // Hier kun je de logica toevoegen om de gegevens te verwerken of op te slaan
    };

    return (
        <div>
            <PageTitle title="Persoonlijk of clubrecord indienen" />
            
            <form className="new_event" onSubmit={submitPR}>
                <p>Gefeliciteerd met je nieuwe PR, vul hem hier in om hem mee te laten tellen voor het PR klassement en/of de clubrecords!</p>
                {/* Soort wedstrijd */}
                <div>
                    <label>Soort wedstrijd:</label>
                    <div className="new_event_radio_group">
                        <input
                            type="radio"
                            value="Indoor"
                            name="soort"
                            onChange={(event) => handleRadioChange(event, dispatch)}
                        />
                        Indoor
                        <input
                            type="radio"
                            value="Outdoor"
                            name="soort"
                            onChange={(event) => handleRadioChange(event, dispatch)}
                        />
                        Outdoor
                    </div>
                </div>

                {/* Onderdeel */}
                {prState.soort && (
                    <div>
                        <label htmlFor="onderdeel">Onderdeel:</label>
                        <select
                            className="new_event_input new_event_select"
                            id="onderdeel"
                            name="onderdeel"
                            value={prState.onderdeel}
                            onChange={(event) => handleSelectChange(event, dispatch)}
                        >
                            <option disabled value="">
                                -- Kies een optie --
                            </option>
                            {prState.soort === "Indoor" &&
                                Onderdelen.indoor.map((item) => <option key={item}>{item}</option>)}
                            {prState.soort === "Outdoor" &&
                                Onderdelen.outdoor.map((item) => (
                                    <option key={item}>
                                        {Array.isArray(item)
                                            ? prState.soort === "Man"
                                                ? item[0]
                                                : item[1]
                                            : item}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                {/* Prestatie */}
                {prState.onderdeel && (
                    <div>
                        <label htmlFor="prestatie">Prestatie:</label>
                        <input
                            className="new_event_input"
                            type="text"
                            id="prestatie"
                            name="prestatie"
                            placeholder={
                                prState.onderdeel.includes("0m")
                                    ? "mm:ss.hh"
                                    : "meters"
                            }
                            value={prState.prestatie}
                            onChange={(event) => handleFormChange(event, dispatch)}
                        />
                    </div>
                )}

                {/* Datum */}
                <div>
                    <label htmlFor="datum">Datum:</label>
                    <input
                        className="new_event_input"
                        type="date"
                        id="datum"
                        name="datum"
                        value={prState.datum}
                        onChange={(event) => handleFormChange(event, dispatch)}
                    />
                </div>

                {/* Plaats */}
                <div>
                    <label htmlFor="plaats">Plaats:</label>
                    <input
                        className="new_event_input"
                        type="text"
                        id="plaats"
                        name="plaats"
                        value={prState.plaats}
                        onChange={(event) => handleFormChange(event, dispatch)}
                    />
                </div>

                {/* Link naar uitslag */}
                <div>
                    <label htmlFor="uitslagLink">Link naar uitslag:</label>
                    <input
                        className="new_event_input"
                        type="url"
                        id="uitslagLink"
                        name="uitslagLink"
                        value={prState.uitslagLink}
                        onChange={(event) => handleFormChange(event, dispatch)}
                    />
                </div>

                {/* Is het een PR? */}
                <div>
                    <label>Is dit een PR?</label>
                    <div className="new_event_radio_group">
                        <input
                            type="radio"
                            value="true"
                            name="isPR"
                            onChange={(event) => handleRadioChange(event, dispatch)}
                        />
                        Ja
                        <input
                            type="radio"
                            value="false"
                            name="isPR"
                            onChange={(event) => handleRadioChange(event, dispatch)}
                        />
                        Nee
                    </div>
                </div>

                <button type="submit" className="leden_table_row_button">
                    Indienen
                </button>
            </form>
        </div>
    );
};

export default PR;