import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import {profile_request} from "../../functions/api";
import PageTitle from "../../components/PageTitle";
import {BirthdayData, bd_request} from "../../functions/api";
import "./Verjaardagen.scss";

const defaultData: BirthdayData[] = [
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-02-25'
    }
]

const Verjaardagen = () => {

    const {authState: ac, setAuthState} = useContext(AuthContext)

    return (
        <>
            <PageTitle title="Verjaardagen"/>
            {!ac.isAuthenticated && (
                <p className="verjaardagen_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {ac.isAuthenticated && (
                <div>
                    
                </div>
                
            )}
        </>
    )
}

export default Verjaardagen;
