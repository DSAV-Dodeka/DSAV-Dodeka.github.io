import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import {profile_request} from "../../functions/api";
import ConfirmUser from "./ConfirmUser";
import PageTitle from "../../components/PageTitle";
import "./Admin.scss";

const Admin = () => {

    const {authState, setAuthState} = useContext(AuthContext)

    return (
        <>
            <PageTitle title="Ledenadministratie"/>
            {authState.isAuthenticated && (
                <p className="admin_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in met een geautorizeerd account om deze pagina te kunnen bekijken.</p>
            )}
            {!authState.isAuthenticated && !authState.scope.includes("admin") && (
                <div>
                    <h1 className="table_title">Nieuwe leden</h1>
                    <div className="table_container">
                        <ConfirmUser/>
                    </div>
                </div>
                
            )}
            {authState.isAuthenticated && !authState.scope.includes("admin") && (
                <p className="admin_status">Deze pagina is helaas niet toegankelijk voor jouw account. Log in met een geautorizeerd account om deze pagina te kunnen bekijken.</p>
            )}
        </>
    )
}

export default Admin;




