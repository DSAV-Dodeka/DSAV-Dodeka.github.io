import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../Auth/AuthContext";
import PageTitle from "../../../components/PageTitle";
import HordesContent from "../../../content/Hordes.json";
import Horde from "./components/Horde";
import "./Hordes.scss";

const Hordes = () => {
    const {authState, setAuthState} = useContext(AuthContext)

    return (
        <>
            <PageTitle title="Hordes"/>
            {!authState.isAuthenticated && (
                <p className="hordes_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {authState.isAuthenticated && (
                <div className="hordes_container">
                    {HordesContent.hordes.map(horde => 
                        <Horde {...horde}/>
                    )}
                </div>
            )}
        </>
    )
}

export default Hordes;
