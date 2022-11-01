import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import {profile_request} from "../../functions/api";
import ConfirmUser from "./ConfirmUser";
import LedenInfo from "./LedenInfo";
import PageTitle from "../../components/PageTitle";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("Leden");
    const {authState, setAuthState} = useContext(AuthContext)

    return (
        <>
            <PageTitle title="Ledenadministratie"/>
            {!authState.isAuthenticated && (
                <p className="admin_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in met een geautorizeerd account om deze pagina te kunnen bekijken.</p>
            )}
            {authState.isAuthenticated && authState.scope.includes("admin") && (
                <>
                    <p className="admin_status admin_mobile">Deze pagina is voorlopig alleen te gebruiken op pc.</p>
                    <div className="admin_pc">
                        <div className="admin_toggle">
                            <h1 className={activeTab == "Leden" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("Leden")}>Leden</h1>
                            <h1 className={activeTab == "Aanmeldingen" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("Aanmeldingen")}>Aanmeldingen</h1>
                            <h1 className={activeTab == "Klassementen" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("Klassementen")}>Klassementen</h1>
                        </div>
                        <div className="table_container">
                            {
                                {
                                    "Leden": <LedenInfo />,
                                    "Aanmeldingen": <ConfirmUser />,
                                    "Klassementen": <p>Coming soon</p>
                                }[activeTab]
                            }
                        </div>
                    </div>
                </>
            )}
            {authState.isAuthenticated && !authState.scope.includes("admin") && (
                <p className="admin_status">Deze pagina is helaas niet toegankelijk voor jouw account. Log in met een geautorizeerd account om deze pagina te kunnen bekijken.</p>
            )}
        </>
    )
}

export default Admin;




