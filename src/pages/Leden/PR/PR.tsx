import React, {ChangeEvent, FormEvent, useContext, useReducer, useState} from "react";
import {formReducer, handleFormChange, handleSelectChange, handleTextAreaChange, handleRadioChange} from "../../../functions/forms";
import AuthContext from "../../Auth/AuthContext";
import Onderdelen from "../../../content/Onderdelen.json";
import "./PR.scss";

interface PRProps {
    closePR: () => Promise<void>
}

interface PRState {
    geslacht: string
    soort: string
    onderdeel: string
    senioren: boolean
    prestatie: string
    datum: string
    plaats: string
}

const initialState: PRState = {
    geslacht: "",
    soort: "",
    onderdeel: "",
    senioren: false,
    prestatie: "",
    datum: "",
    plaats: ""
}

const PR = ({closePR} : PRProps ) => {
    
    const [prState, dispatch] = useReducer(
        formReducer<PRState>,
        initialState,
    )

    const submitPR  = async (e: FormEvent) => {
        
    }

    return (
        <div>
            <div className="new_event_container" />
            <form className="new_event" onSubmit={submitPR}>
                <p className="new_event_title">Persoonlijk record insturen</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="new_event_cross" onClick={closePR} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                <div>
                    <label>Geslacht:</label>
                    <div>
                        <input type="radio" value="Man" name="geslacht" onChange={(event) => handleRadioChange(event, dispatch)}/>Man
                        <input type="radio" value="Vrouw" name="geslacht" onChange={(event) => handleRadioChange(event, dispatch)}/>Vrouw
                    </div>
                </div>
                <div>
                    <label>Soort wedstrijd:</label>
                    <div>
                        <input type="radio" value="Indoor" name="soort" onChange={(event) => handleRadioChange(event, dispatch)}/>Indoor
                        <input type="radio" value="Outdoor" name="soort" onChange={(event) => handleRadioChange(event, dispatch)}/>Outdoor
                    </div>
                </div>
                {prState.soort !== "" && prState.geslacht !== "" &&
                    <div>
                        <label className="new_event_label" htmlFor="onderdeel">Onderdeel:</label>
                        <select className="new_event_select" id="onderdeel" name="onderdeel" value={prState.onderdeel}
                            onChange={(event) => handleSelectChange(event, dispatch)}>
                            <option disabled value={"none"}>-- Kies een optie --</option>
                            {prState.soort == "Indoor" &&
                                Onderdelen.indoor.map((item) => <option>{item}</option>)
                            }
                            {prState.soort == "Outdoor" && 
                                Onderdelen.outdoor.map((item) => <option>{(Array.isArray(item) ? (prState.geslacht == "Man" ? item[0] : item[1]) : item)}</option>)
                            }
                        </select>
                    </div>
                }
                {(prState.onderdeel.includes("horden") || prState.onderdeel.includes("werpen") || prState.onderdeel.includes("stoten") || prState.onderdeel.includes("slingeren")) &&
                    <div>
                        <label>{prState.onderdeel.includes("horden") ? "Is deze prestatie geleverd met de hordenhoogte voor senioren?": "Is deze prestatie geleverd met het werpgewicht voor senioren?"}</label>
                        <div>
                            <input type="radio" value="Indoor" name="senioren" onChange={(event) => handleRadioChange(event, dispatch)}/>Ja
                            <input type="radio" value="Outdoor" name="senioren" onChange={(event) => handleRadioChange(event, dispatch)}/>Nee
                        </div>
                    </div>
                }
                <div>
                    <label>Prestatie</label>
                    {prState.onderdeel.includes("lon") &&
                        <div>
                            <input type="text" inputMode="numeric"/>
                            <p>Punten</p>
                        </div>
                    }
                    {/* {prState.onderdeel.includes("lon") &&
                        <div>
                            <input type="number" min="0" max="20000"/>
                            <p>Punten</p>
                        </div>
                    } */}
                    
                </div>
                  
                <div className="new_event_half_input">
                        <p className="new_event_label">Datum:</p>
                        <input className="new_event_date" type="date" id="datum" name="datum" value={prState.datum} onChange={(event) => handleFormChange(event, dispatch)}></input><br/>
                </div>
                <div className="new_event_half_input">
                        <p className="new_event_label">Plaats:</p>
                        <input className="new_event_date" type="text" id="datum" name="datum" value={prState.datum} onChange={(event) => handleFormChange(event, dispatch)}></input><br/>
                </div>
                {/* <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="new_event_cross" onClick={closePR} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                    <input className="new_event_input" name="eventId" id="eventId" type="text" value={formState.eventId} onChange={(event) => handleFormChange(event, dispatch)} placeholder="Unieke naam"></input>
                    <div className="new_event_label_full_container">
                        <label className="new_event_label" htmlFor="eventDesc">Omschrijving:</label>
                        <textarea className="new_event_textarea" rows={2} name="eventDesc" spellCheck={false} id="eventDesc"  onChange={(event) => handleTextAreaChange(event, dispatch)} placeholder="Omschrijving" value={formState.eventDesc} />
                    </div>
                    {typeName === "points" && <div className="new_event_label_full_container">
                        <label className="new_event_label" htmlFor="eventCategory">Categorie:</label>
                        <select className="new_event_select" id="eventCategory" name="eventCategory" value={formState.eventCategory}
                                onChange={(event) => handleSelectChange(event, dispatch)}>
                            <option disabled value={"none"}>-- Kies een optie --</option>
                            {EventCategories.event_types.map((item) => <option>{item.type}</option>)}
                        </select>
                    </div>}
                    <div className="new_event_half_input">
                        <p className="new_event_label">Datum:</p>
                        <input className="new_event_date" type="date" id="eventDate" name="eventDate" value={formState.eventDate} onChange={(event) => handleFormChange(event, dispatch)}></input><br/>
                    </div>
                    <div>
                        <p className="new_event_label_type">Upload bestand met punten:</p>
                        <input className="new_event_file" type="file" accept=".csv" onChange={handleFileUpload}></input>
                    </div>

                </div>
                {fileUploaded && duplicateLeden.length > 0 && <div>
                    <div className="new_event_half">
                        <p className="new_event_label_members">Namen komen dubbel voor:</p>
                        <>
                            {duplicateLeden.map((item) => {
                                return <p key={`${item.name}_${item.points}_${item.points}`}>{item.name} ({item.points} punten)</p>
                            })}
                        </>
                        <br />
                    </div>
                </div>}
                {fileUploaded && duplicateLeden.length == 0 && <div className="new_event_selected">
                    <div className="new_event_half">
                        <p className="new_event_label_members">Geselecteerde leden:</p>
                        <>
                            {geselecteerdeLeden.map((item) => {
                                return <p key={item.name + item.matchedName}>{item.name}: {item.matchedName} (+{item.points} punten)</p>
                            })}
                            {geselecteerdeLeden.length === 0 && <p>Helaas komen geen van de leden in het bestand overeen met bestaande leden.</p>}
                        </>

                    </div>
                    <div className="new_event_half">
                        <p className="new_event_label_members">Niet herkende leden:</p>
                        <>
                            {onherkend.map((item) => {
                                return <p key={item.name} className="onherkend">'{item.name}' ({item.points} punten)</p>
                            })}
                            {onherkend.length === 0 && <p>Er zijn geen onherkende leden.</p>}
                        </>
                    </div>
                    <div className="new_event_half">
                        <p className="new_event_label_members">Niet-unieke namen:</p>
                        <>
                            {multiLeden.map((item, index) => {
                                return <p key={item.name + index} className="onherkend">Naam: {item.name} — Mogelijke leden: {item.matchedNames.join(', ')} {
                                }</p>
                            })}
                            {multiLeden.length === 0 && <p>Er zijn geen namen met meerdere mogelijkheden.</p>}
                        </>
                    </div>
                </div>} */}
                {/* {uploadError && <div className="new_event_submit_error">{uploadError}</div>} */}
                <button className="leden_table_row_button">Voeg toe</button>
            </form>
        </div>
    )
}

export default PR;