import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import {profile_request} from "../../functions/api";
import ConfirmUser from "./ConfirmUser";
import PageTitle from "../../components/PageTitle";

const Admin = () => {

    const {authState, setAuthState} = useContext(AuthContext)

    const [accessScope, setAccessScope] = useState("")
    const [accessRaw, setAccessRaw] = useState("")
    const [refresh, setRefresh] = useState("")

    const loadScope = async (accessRawStr: string) => {
        const { profile, returnedState, changedState  } = await profile_request(accessRawStr, refresh, authState)
        if (changedState) {
            setAuthState(returnedState)
        }
        setAccessScope(profile.scope)
    }

    const setProfile = async () => {
        const access = localStorage.getItem("access")
        if (access) {
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

    return (
        <>
            <PageTitle title="Admin panel"/>
            {!authState.isAuthenticated && (
                <p>Niet geauthenticeerd.</p>
            )}
            {authState.isAuthenticated && accessScope.includes("admin") && (
                <div>
                <ConfirmUser access={accessRaw} refresh={refresh} />
                </div>
            )}
            {authState.isAuthenticated && !accessScope.includes("admin") && (
                <p>Niet geautorizeerd.</p>
            )}
        </>
    )
}

export default Admin;




