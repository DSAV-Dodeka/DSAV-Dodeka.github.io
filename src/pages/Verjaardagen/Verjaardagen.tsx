import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../Auth/AuthContext";
import {profile_request} from "../../functions/api";
import PageTitle from "../../components/PageTitle";
import {BirthdayData, bd_request} from "../../functions/api";
import Maand from "./components/Maand";
import "./Verjaardagen.scss";
import { number } from "zod";

const maanden = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]

const defaultData: BirthdayData[] = [
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-02-25'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-03-25'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-01-25'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-05-25'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-10-25'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-10-26'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-10-27'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2022-12-25'
    },
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        birthdate: '2021-11-25'
    },
    {
        firstname: 'Matthijs',
        lastname: 'Arnoldus',
        birthdate: '2000-12-10'
    }
]

function getAge(birthdate: string) {
    var currentYear = new Date().getFullYear()
    var dateCurrent = (new Date(birthdate))
    dateCurrent.setFullYear(currentYear)
    if (dateCurrent < new Date()) dateCurrent.setFullYear(currentYear + 1);
    return dateCurrent.getFullYear() - new Date(birthdate).getFullYear();
}

function sortBirthdays(a: string, b: string) {
    var currentYear = new Date().getFullYear() 
    var aCurrent = (new Date(a))
    aCurrent.setFullYear(currentYear)
    if (aCurrent < new Date()) aCurrent.setFullYear(currentYear + 1);
    var bCurrent = (new Date(b))
    bCurrent.setFullYear(currentYear)
    if (bCurrent < new Date()) bCurrent.setFullYear(currentYear + 1);
    if (aCurrent < bCurrent) return -1;
    if (aCurrent > bCurrent) return 1;
    return 0;
}

const Verjaardagen = () => {

    const {authState: ac, setAuthState} = useContext(AuthContext)

    defaultData.sort((a,b) => sortBirthdays(a.birthdate, b.birthdate))

    return (
        <>
            <PageTitle title="Verjaardagen"/>
            {ac.isAuthenticated && (
                <p className="verjaardagen_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {!ac.isAuthenticated && (
                <div>
                    {defaultData.map((item, index, array) => {
                        if (index == 0 || new Date(item.birthdate).getMonth() > new Date(array[index - 1].birthdate).getMonth()) {
                            return (
                            <>
                                <Maand maand={maanden[new Date(item.birthdate).getMonth()]} />
                                <p>{new Date(item.birthdate).getDate() + " " + getAge(item.birthdate) + " jaar"}</p>
                            </>)
                        }
                        return (<p>{new Date(item.birthdate).getDate() + " " + getAge(item.birthdate) + " jaar"}</p>)
                    }
                        
                    )}
                </div>
                
            )}
        </>
    )
}

export default Verjaardagen;
