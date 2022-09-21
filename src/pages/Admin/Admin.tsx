import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthState, refresh_tokens, useAuth} from "../Auth/AuthContext";
import {profile_request} from "../Auth/functions/Request";
import {decodeJwtPayload} from "../Auth/functions/OAuth";
import ConfirmUser from "./ConfirmUser";

const Admin = () => {

    const {authState, setAuthState} = useContext(AuthContext)

    const [user, setUser] = useState("")
    const [accessScope, setAccessScope] = useState("")
    const [accessRaw, setAccessRaw] = useState("")
    const [access, setAccess] = useState("")
    const [refresh, setRefresh] = useState("")

    const loadScope = async (accessRawStr: string) => {
        const { profile, returnedState, changedState  } = await profile_request(accessRawStr, refresh, authState)
        if (changedState) {
            setAuthState(returnedState)
        }
        setUser(profile.username)
        setAccessScope(profile.scope)
    }

    const setProfile = async () => {
        const access = localStorage.getItem("access")
        if (access) {
            const decodedAccess = decodeJwtPayload(access)
            setAccess(decodedAccess)
            setAccessRaw(access)
            await loadScope(access)
        }

        const refresh = localStorage.getItem("refresh")
        if (refresh) {
            setRefresh(refresh)
        }
    }

    useEffect(() => {
        if (authState.isLoaded) {
            setProfile().catch()
        }
    }, [authState]);

    const doRefresh = async () => {
        const refreshed = await refresh_tokens(refresh)
        if (refreshed) {
            const newAs = await useAuth()
            setAuthState(newAs)
        }
    }

    return (
        <>
            <p>{!authState.isLoaded && "is loading"}</p>
            <p>{authState.isLoaded && "loaded"}</p>
            <div>
                <ul>
                    <li><strong>Username:</strong> {user}</li>
                    <li><strong>Access scope:</strong> {accessScope}</li>
                </ul>
            </div>
            {authState.isAuthenticated && (
                <div>
                <div>
                    <ul>
                        <li><strong>Authenticated:</strong> {`${authState.isAuthenticated}`}</li>
                        <li><strong>Access Token:</strong> {access}</li>
                        <li><strong>Raw Access:</strong> {accessRaw}</li>
                        <li><strong>Refresh Token:</strong> {refresh}</li>
                        <li><button onClick={doRefresh}>Refresh</button></li>
                    </ul>
                </div>
                <ConfirmUser access={accessRaw} refresh={refresh} />
                </div>
            )}
        </>
    )
}

export default Admin;




