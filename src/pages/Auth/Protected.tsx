import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthState, refresh_tokens, useAuth} from "./AuthContext";
import {decodeJwtPayload} from "./functions/OAuth";
import Timer from "./Timer";


const Protected = () => {

    const {authState, setAuthState} = useContext(AuthContext)

    const [user, setUser] = useState("")
    const [accessScope, setAccessScope] = useState("")
    const [accessRaw, setAccessRaw] = useState("")
    const [access, setAccess] = useState("")
    const [refresh, setRefresh] = useState("")

    const loadScope = async () => {
        const bearer = 'Bearer ' + accessRaw
        const res = await fetch(`http://localhost:4243/res/profile/`, {
            method: 'GET',
            headers: {
                'Authorization': bearer
            }
        })

        const { username, scope } = await res.json()
        setUser(username)
        setAccessScope(scope)
    }

    const setProfile = async () => {
        const access = localStorage.getItem("access")
        if (access) {
            const decodedAccess = decodeJwtPayload(access)
            setAccess(decodedAccess)
            setAccessRaw(access)
        }

        const refresh = localStorage.getItem("refresh")
        if (refresh) {
            setRefresh(refresh)
        }
    }

    useEffect(() => {
        setProfile().catch()
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
                        <li><strong>Raw Access:</strong> {accessRaw}</li>
                        <li><strong>Refresh Token:</strong> {refresh}</li>
                        <li><Timer /></li>
                        <li><button onClick={doRefresh}>Refresh</button></li>
                    </ul>
                </div>
            )}
        </>
    )
}

export default Protected;




