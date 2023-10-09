import React, {useContext, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import ConfirmUser from "./components/ConfirmUser";
import LedenInfo from "./components/LedenInfo";
import Rollen from "./components/Rollen";
import Klassement, {KlassementProps} from "./components/Klassement";
import PrCheck from "./components/PrCheck";
import PageTitle from "../../components/PageTitle";
import "./Admin.scss";


const trainingProps: KlassementProps = {
    typeName: "training",
    addText: "Voeg trainingen toe",
    headerText: "Aantal trainingen",
    viewEventText: "Bekijk trainingen"
}

const pointsProps: KlassementProps = {
    typeName: "punten",
    addText: "Voeg evenement toe",
    headerText: "Aantal punten",
    viewEventText: "Bekijk evenementen"
}


const Admin = () => {
    const [activeTab, setActiveTab] = useState("Leden");
    const {authState, setAuthState} = useContext(AuthContext)

    return (
        <div className="admin_container">
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
                            <h1 className={activeTab == "Puntenklassement" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("Puntenklassement")}>Puntenklassement</h1>
                            <h1 className={activeTab == "Trainingsklassement" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("Trainingsklassement")}>Trainingsklassement</h1>
                            <h1 className={activeTab == "Rollen" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("Rollen")}>Rollen</h1>
                            <h1 className={activeTab == "PRs goedkeuren" ? "admin_toggle_active" : ""} onClick={() => setActiveTab("PRs goedkeuren")}>PRs goedkeuren</h1>
                        </div>
                        <div className="table_container">
                            {
                                {
                                    "Leden": <LedenInfo />,
                                    "Aanmeldingen": <ConfirmUser />,
                                    "Puntenklassement": <Klassement {...pointsProps} />,
                                    "Trainingsklassement": <Klassement {...trainingProps} />,
                                    "Rollen": <Rollen />,
                                    "PRs goedkeuren": <PrCheck />
                                }[activeTab]
                            }
                        </div>
                    </div>
                </>
            )}
            {authState.isAuthenticated && !authState.scope.includes("admin") && (
                <p className="admin_status">Deze pagina is helaas niet toegankelijk voor jouw account. Log in met een geautorizeerd account om deze pagina te kunnen bekijken.</p>
            )}
        </div>
    )
}

export default Admin;




