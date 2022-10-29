import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthState, useRenewal} from "./AuthContext";
import {decodeJwtPayload} from "./functions/OAuth";
import Timer from "./Timer";
import {back_post_auth, profile_request} from "../../functions/api";
import "./Profiel.scss";

const Profiel = () => {
    const {authState, setAuthState} = useContext(AuthContext)

    const [user, setUser] = useState("")
    const [access, setAccess] = useState("")
    const [accessScope, setAccessScope] = useState("")
    const [newEmail, setNewEmail] = useState("")


    const loadScope = async () => {
        const profile = await profile_request({authState, setAuthState})
        setUser(profile.username)
        setAccessScope(profile.scope)
    }

    const setProfile = async () => {
        if (authState.isAuthenticated) {
            const decodedAccess = decodeJwtPayload(authState.access)
            setAccess(decodedAccess)
        }
    }

    useEffect(() => {
        setProfile().catch()
    }, [authState]);

    const doRefresh = async () => {
        const newState = await useRenewal(authState)
        setAuthState(newState)
    }

    const handleNewEmailSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        const req = {
            "user_id": authState.username,
            "new_email": newEmail
        }

        await back_post_auth("update/email/send/", req, {authState, setAuthState})
    }

    return (
        <>
            {!authState.isAuthenticated && (
                <p className="profiel_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {authState.isAuthenticated && (
                <div className="profiel">
                    <p className="profiel_naam">{authState.it.given_name + " " + authState.it.family_name}</p>
                    <p className="profiel_info">Geboortedatum: {new Date(authState.it.birthdate).getDate() + "/" + (new Date(authState.it.birthdate).getMonth() + 1) + "/" + new Date(authState.it.birthdate).getFullYear()}</p>
                    <p className="profiel_info">Lid sinds:</p>
                    <p className="profiel_info">E-mailadres: {authState.it.email}</p>
                    <p className="profiel_info">Telefoonnummer:</p>
                    <p className="profiel_info">Adres:</p>
                    <p className="profiel_info">Student: </p>
                    <p className="profiel_info">Onderwijsinstelling: </p>
                    <div>
                        <form onSubmit={handleNewEmailSubmit}>
                            <label htmlFor="newEmail">Vul je nieuwe emailadres in om een email te versturen om die te veranderen.</label>
                            <input id="newEmail" placeholder="Nieuwe email" type="text" value={newEmail}
                                   onChange={e => setNewEmail(e.target.value)}/>
                            <button id="newEmailSubmit" type="submit">Verzenden</button>
                        </form>
                    </div>
                    <div className="profiel_highlights">
                        <p>Trainingsklassement:</p>
                        <p>12 punten</p>
                        <p>Puntenklassement:</p>
                        <p>12 punten</p>
                        <p>Eastereggs gevonden:</p>
                        <p>0/12</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Profiel;




