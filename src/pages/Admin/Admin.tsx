import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import {profile_request} from "../../functions/api";
import ConfirmUser from "./ConfirmUser";
import PageTitle from "../../components/PageTitle";

const Admin = () => {

    const {authState, setAuthState} = useContext(AuthContext)

    return (
        <>
            <PageTitle title="Admin panel"/>
            {!authState.isAuthenticated && (
                <p>Niet geauthenticeerd.</p>
            )}
            {authState.isAuthenticated && authState.scope.includes("admin") && (
                <div>
                <ConfirmUser/>
                </div>
            )}
            {authState.isAuthenticated && !authState.scope.includes("admin") && (
                <p>Niet geautorizeerd.</p>
            )}
        </>
    )
}

export default Admin;




