import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthState, useRenewal} from "../Auth/AuthContext";
import {decodeJwtPayload} from "../Auth/functions/OAuth";
import Timer from "../Auth/Timer";
import {back_post_auth, profile_request} from "../../functions/api";
import "./Profiel.scss";

const ProfielDebug = () => {
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
            <p>{!authState.isLoaded && "is loading"}</p>
            <p>{authState.isLoaded && "loaded"}</p>
            <div>
                <ul>
                    <li><button onClick={loadScope}>Load Scope</button></li>
                    <li><strong>Username:</strong> {user}</li>
                    <li><strong>Access scope:</strong> {accessScope}</li>
                </ul>
            </div>
            {authState.isAuthenticated && (
                <div>
                    <ul>
                        <li><strong>Authenticated:</strong> {`${authState.isAuthenticated}`}</li>
                        <li><strong>Access Token:</strong> {access}</li>
                        <li><strong>ID Token:</strong> {JSON.stringify(authState.it)}</li>
                        <li><strong>Raw Access:</strong> {authState.access}</li>
                        <li><strong>Refresh Token:</strong> {authState.refresh}</li>
                        <li><Timer /></li>
                        <li><button onClick={doRefresh}>Refresh</button></li>

                    </ul>
                    <div>
                        <form onSubmit={handleNewEmailSubmit}>
                            <label htmlFor="newEmail">Vul je nieuwe emailadres in om een email te versturen om die te veranderen.</label>
                            <input id="newEmail" placeholder="Nieuwe email" type="text" value={newEmail}
                                   onChange={e => setNewEmail(e.target.value)}/>
                            <button id="newEmailSubmit" type="submit">Verzenden</button>
                        </form>
                    </div>
                </div>

            )}
        </>
    )
}

export default ProfielDebug;




