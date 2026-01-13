import React, {type ChangeEvent, type FormEvent, useContext, useReducer, useState} from "react";
import {back_post_auth, catch_api} from "../../../functions/api/api";
import AuthContext from "../../Auth/AuthContext";
import {matchNames, type MultiMatch, parseFile} from "../functions/parse";
import {z} from "zod";
import {type UserNames} from "../../../functions/api/klassementen";
import {formReducer, handleFormChange, handleSelectChange, handleTextAreaChange} from "../../../functions/forms";
import EventCategories from "../../../content/EventTypes.json";

const rowSchema = z.object({
    name: z.string(),
    points: z.coerce.number()
})

type Row = z.infer<typeof rowSchema>
type DuplicateRow = Row & { num: number }
interface Matched {
    name: string
    points: number
    matchedName: string
    user_id: string
}

interface NewEventProps {
    namesData: UserNames[]
    typeName: "points" | "training"
    addText: string
    clearEvent: () => Promise<void>
}

interface FormState {
    eventId: string
    eventDesc: string
    eventDate: string
    eventCategory: string
}

const initialState: FormState = {
    eventId: "",
    eventDesc: "",
    eventDate: "",
    eventCategory: "none"
}

const NewEvent = ({namesData, typeName, addText, clearEvent}: NewEventProps) => {
    const {authState, setAuthState} = useContext(AuthContext);
    const [geselecteerdeLeden, setGeselecteerdeLeden] = useState<Matched[]>([]);
    const [multiLeden, setMultiLeden] = useState<MultiMatch<Row>[]>([]);
    const [onherkend, setOnherkend] = useState<Row[]>([]);
    const [duplicateLeden, setDuplicateLeden] = useState<DuplicateRow[]>([])
    const [uploadError, setUploadError] = useState("")
    const [fileUploaded, setFileUploaded] = useState(false);

    const [formState, dispatch] = useReducer(
        formReducer<FormState>,
        initialState,
    )

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        clearEventState()

        const files = e.target.files
        if (files === null || files.length === 0) {
            setFileUploaded(false)
            return
        }

        setFileUploaded(true);

        const errCallback = (e: unknown) => {
            console.error('err reading file ' + JSON.stringify(e))
            setUploadError("Fout met het inlezen van het bestand! Is het een .csv en is de eerste kolom 'name' en de tweede 'points'?")
        }

        const resultCallback = (found: Row[]) => {
            const sortedFound = found
                .sort((r1, r2) => r1.name.localeCompare(r2.name))
            const foundLength = sortedFound.length
            let duplicates: DuplicateRow[];
            if (foundLength > 1) {
                duplicates = sortedFound.filter((v, i, a) => {
                    // If i > i we look at the previous value, if they are equal, it is a duplicate
                    if (i === 0 && foundLength > 1) {
                        return a[i+1].name === v.name
                    } else {
                        return a[i-1].name === v.name
                    }
                }).map((v, i) => { return {...v, num: i} })
            } else {
                duplicates = []
            }

            if (duplicates.length > 0) {
                setDuplicateLeden(duplicates)
                return
            }
            const { noMatch,  uniqueMatch, multipleMatch} = matchNames(namesData, found)
            setGeselecteerdeLeden(uniqueMatch)
            setMultiLeden(multipleMatch)
            setOnherkend(noMatch)
            setUploadError("")
        }

        parseFile(files, rowSchema, resultCallback, errCallback)
    }

    const clearEventState = () => {
        setFileUploaded(false);
        setGeselecteerdeLeden([]);
        setOnherkend([]);
        setDuplicateLeden([]);
        setMultiLeden([])
    }

    const clearUpload = async () => {
        await clearEvent();
        clearEventState()
    }


    const submitTraining = async (e: FormEvent) => {
        e.preventDefault()
        if (duplicateLeden.length >  0) {
            setUploadError("Er zijn namen die meerdere keren voorkomen. Maak deze namen eerst uniek (voeg bijvoorbeeld de eerste letter van de achternaam toe).")
            return;
        }
        if (multiLeden.length > 0 || onherkend.length > 0) {
            setUploadError("Er zijn nog niet herkende namen of namen met meerdere mogelijkheden (scroll als ze niet allemaal zichtbaar zijn). Pas het document aan zodat deze er niet meer zijn. Mensen zonder account kunnen niet worden toegevoegd.")
            return;
        }
        const category = typeName === "training" ? "training" : formState.eventCategory
        setUploadError("")
        const req = {
            "users": geselecteerdeLeden,
            "class_type": typeName,
            'date': formState.eventDate,
            'event_id':formState.eventId,
            'category': category,
            'description': formState.eventDesc
        }
        try {
            await back_post_auth("admin/class/update/", req, {authState, setAuthState})
            await clearUpload()
        } catch (e) {
            const err = await catch_api(e)
            setUploadError(err.error_description)
        }
    }

    return (
        <div>
            <div className="new_event_container" />
            <form className="new_event" onSubmit={submitTraining}>
                <p className="new_event_title">{addText}</p>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="new_event_cross" onClick={clearUpload} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
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
                </div>}
                {uploadError && <div className="new_event_submit_error">{uploadError}</div>}
                <button className="leden_table_row_button">Voeg toe</button>
            </form>
        </div>
    )
}

export default NewEvent;