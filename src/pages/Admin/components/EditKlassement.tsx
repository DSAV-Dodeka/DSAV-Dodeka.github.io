import { ChangeEvent, FormEvent, useContext, useMemo, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import ModalForm from "../../../components/Modal/ModalForm";
import './Klassement.scss'
import { queryError, useClassMetaQuery } from "../../../functions/queries";
import AuthContext from "../../Auth/AuthContext";
import { ClassMetaList } from "../../../functions/api/klassementen";
import { ISODate } from "../../../functions/date";
import { back_post_auth, catch_api } from "../../../functions/api/api";
import { useQueryClient } from "@tanstack/react-query";

const EditKlassement = () => {
    const {authState, setAuthState} = useContext(AuthContext);
    const queryClient = useQueryClient()
    
    const defaultClass: ClassMetaList = [
        { "classification_id": 1, "type": "training", "start_date": new Date("2023-01-01"), "hidden_date": new Date("2024-01-01"), "end_date": new Date("2024-01-01") },
        { "classification_id": 3, "type": "points", "start_date": new Date("2024-01-01"), "hidden_date": new Date("2024-01-01"), "end_date": new Date("2024-01-01") },
        { "classification_id": 2, "type": "points", "start_date": new Date("2023-01-01"), "hidden_date": new Date("2024-01-01"), "end_date": new Date("2024-01-01") },
    ]

    const [postStatus, setPostStatus] = useState({"isOk": true, msg: ""})

    const qNames = useClassMetaQuery({ authState, setAuthState })
    const classData = queryError(qNames, defaultClass, `Class Meta Admin Query Error`)

    const [hiddenPublish, setHiddenPublish] = useState('hide')

    const [showEdit, setShowEdit] = useState(false)
    const [showNewClass, setShowNewClass] = useState(false)
    const [showRemoveClass, setShowRemoveClass] = useState(false)

    const mostRecentClass = classData[0]

    const [openClass, setOpenClass] = useState(mostRecentClass.classification_id)
    const selectedClass = useMemo(() => {
        const selected = classData.find(c => c.classification_id === openClass)
        if (selected === undefined) {
            throw new Error("Cannot find selected classId!")
        }
        return selected
    }, [openClass]);

    const [hiddenDate, setHiddenDate] = useState(ISODate(mostRecentClass.hidden_date))
    const [endDate, setEndDate] = useState(ISODate(mostRecentClass.end_date))
    const [startDate, setStartDate] = useState(ISODate(mostRecentClass.start_date))

    const syncClass = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await back_post_auth(`admin/class/sync/?publish=${hiddenPublish}`, {}, {authState, setAuthState})
            setPostStatus({ isOk: true, msg: "Klassement gesynchronizeerd!"})
        } catch (e) {
            const err = await catch_api(e)
            setPostStatus({ isOk: true, msg: err.error_description})
        }
    }

    const modifyClass = async (e: FormEvent) => {
        e.preventDefault()
        const req = {
            "classification_id": openClass,
            "end_date": endDate,
            "start_date": startDate,
            "hidden_date": hiddenDate
        }
        try {
            await back_post_auth("admin/class/modify/", req, {authState, setAuthState})
            await queryClient.invalidateQueries({ queryKey: ['class_meta'] })
            setPostStatus({ isOk: true, msg: "Klassement aangepast!"})
        } catch (e) {
            const err = await catch_api(e)
            setPostStatus({ isOk: true, msg: err.error_description})
        }
    }

    const newClasses = async () => {
        try {
            await back_post_auth("admin/class/new/", {}, {authState, setAuthState})
            await queryClient.invalidateQueries({ queryKey: ['class_meta'] })
            setPostStatus({ isOk: true, msg: "Nieuwe klassementen toegevoegd!"})
        } catch (e) {
            const err = await catch_api(e)
            setPostStatus({ isOk: true, msg: err.error_description})
        }
    }

    const removeClasses = async () => {
        try {
            await back_post_auth(`admin/class/remove/${openClass}`, {}, {authState, setAuthState})
            await queryClient.invalidateQueries({ queryKey: ['class_meta'] })
            setPostStatus({ isOk: true, msg: "Klassement verwijderd!"})
        } catch (e) {
            const err = await catch_api(e)
            setPostStatus({ isOk: true, msg: err.error_description})
        }
    }

    const clickNewClass = () => {
        setShowEdit(false)
        setShowNewClass(true)
        setPostStatus({ isOk: true, msg: ""})
    }

    const clickRemoveClass = () => {
        setShowEdit(false)
        setShowRemoveClass(true)
        setPostStatus({ isOk: true, msg: ""})
    }

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newClassId = parseInt(event.target.value)
        const newClass = classData.find(c => c.classification_id === newClassId)
        if (newClass === undefined) {
            throw new Error(`classId ${newClassId} could not be found in classData!`)
        }
       
        setHiddenDate(ISODate(newClass.hidden_date))
        setEndDate(ISODate(newClass.end_date))
        setStartDate(ISODate(newClass.start_date))
        setOpenClass(newClassId)
    }

    const handleChangeHiddenPublish = (event: ChangeEvent<HTMLSelectElement>) => {
        setHiddenPublish(event.target.value)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, dateType: "hidden" | "end" | "start") => {
        if (dateType === "hidden") {
            setHiddenDate(event.target.value)
        } else if (dateType === "end") {
            setEndDate(event.target.value)
        } else if (dateType === "start") {
            setStartDate(event.target.value)
        }
    }

    return (
        <>
            {mostRecentClass.classification_id}
            <button className="edit-button" onClick={() => {
                setShowEdit(true)
                setPostStatus({ isOk: true, msg: ""})
            }}>Pas aan</button>
            <Modal Title={"Verwijder klassement"} Content={
                <div className="new-class-container">
                    <p>
                        Weet je zeker dat je het {`${selectedClass.type === 'points'}` ? 'punten' : 'trainings'}klassement (id {openClass}) dat gestart 
                        is op {ISODate(selectedClass.start_date)} wil verwijderen?
                    </p>
                    <button className="edit-class-button" onClick={removeClasses}>Verwijder</button>
                    <span className={postStatus.isOk ? "okStatus" : "badStatus"}>{postStatus.msg}</span>
                </div>
            } show={showRemoveClass} setShow={setShowRemoveClass} />
            <Modal Title={"Nieuw klassement"} Content={
                <div className="new-class-container">
                    <p>
                        Weet je zeker dat je nieuwe klassementen wil starten? 
                        Dit maakt het oude klassement onzichtbaar en start een nieuw traings- en puntenklassement.
                    </p>
                    <button className="edit-class-button" onClick={newClasses}>Maak aan</button>
                    <span className={postStatus.isOk ? "okStatus" : "badStatus"}>{postStatus.msg}</span>
                </div>
            } show={showNewClass} setShow={setShowNewClass} />
            <Modal Title={"Pas aan"} Content={<div className="edit-class-container">
                <button className="edit-class-button" onClick={clickNewClass}>Maak nieuwe klassementen aan</button>
                <hr />
                <button className="edit-class-button" onClick={clickRemoveClass}>Verwijder klassement</button>
                <hr />
                <ModalForm Content={
                    <>
                        <label htmlFor="publishHidden">Klassement:
                        <select id="publishHidden" value={openClass} onChange={handleSelectChange}>
                            {classData.map(k => {
                                return (
                                    <option key={`classOption${k.classification_id}`} value={`${k.classification_id}`}>
                                        {`${k.type === 'training' ? 'Punten' : 'Trainings'}klassement ${k.start_date.toLocaleDateString('nl-NL')} (${k.classification_id})`}
                                    </option>

                                )
                            })}
                        </select></label>
                    </>
                } onSubmit={(e) => { e.preventDefault() }} />
                <hr />
                <ModalForm Content={
                    <>
                        <label htmlFor="publishHidden">Verborgen punten:
                        <select id="publishHidden" value={hiddenPublish} onChange={handleChangeHiddenPublish}>
                            <option value="hide">Hide</option>
                            <option value="publish">Publish</option>
                        </select></label>
                        <button>Synchronizeer</button>
                    </>
                } onSubmit={syncClass} />
                <hr />
                <ModalForm Content={
                    <>
                        <label htmlFor="startDate">Startdatum:
                        <input type="date" id="startDate" value={startDate} onChange={(e) => handleInputChange(e, 'start')}></input>
                        </label>
                        
                        <label htmlFor="hiddenDate">Bevriesdatum:
                        <input type="date" id="hiddenDate" value={hiddenDate} onChange={(e) => handleInputChange(e, 'hidden')}></input>
                        </label>

                        <label htmlFor="endDate">Einddatum:
                        <input type="date" id="endDate" value={endDate} onChange={(e) => handleInputChange(e, 'end')}></input>
                        </label>

                        <button>Sla op</button>
                    </>
                } onSubmit={modifyClass} />
                <span className={postStatus.isOk ? "okStatus" : "badStatus"}>{postStatus.msg}</span>
            </div>} show={showEdit} setShow={setShowEdit} />
        </>
    )
}

export default EditKlassement;