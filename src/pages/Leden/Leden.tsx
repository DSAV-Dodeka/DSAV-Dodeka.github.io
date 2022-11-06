import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Auth/AuthContext";
import PageTitle from "../../components/PageTitle";
import "./Leden.scss";
import getUrl from "../../functions/links";

const Leden = () => {
    const {authState: ac, setAuthState} = useContext(AuthContext)

    return (
        <>
            <PageTitle title="Leden"/>
            {!ac.isAuthenticated && (
                <p className="leden_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {ac.isAuthenticated && (
                <div className="leden_routes">
                    <Link className="leden_link" to='verjaardagen' >
                        <h1 className="leden_link_header">Verjaardagen</h1>
                        <img src={getUrl("/wedstrijden/records.png")} className="leden_link_image" alt=""/>
                    </Link>
                </div>
                
            )}
        </>
    )
}

export default Leden;