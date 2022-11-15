import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../Auth/AuthContext";
import {profile_request} from "../../../functions/api";
import PageTitle from "../../../components/PageTitle";
import {BirthdayData, bd_request} from "../../../functions/api";
import Maand from "./components/Maand";
import Verjaardag from "./components/Verjaardag";
import "./Verjaardagen.scss";
import { number } from "zod";

const maanden = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
const dagen = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"]

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
    const currentYear = new Date().getFullYear()
    const dateCurrent = (new Date(birthdate))
    dateCurrent.setFullYear(currentYear)
    if (dateCurrent < new Date()) dateCurrent.setFullYear(currentYear + 1);
    return dateCurrent.getFullYear() - new Date(birthdate).getFullYear();
}

function sortBirthdays(a: string, b: string) {
    const currentYear = new Date().getFullYear() 
    const aCurrent = (new Date(a))
    aCurrent.setFullYear(currentYear)
    if (aCurrent < new Date()) aCurrent.setFullYear(currentYear + 1);
    const bCurrent = (new Date(b))
    bCurrent.setFullYear(currentYear)
    if (bCurrent < new Date()) bCurrent.setFullYear(currentYear + 1);
    if (aCurrent < bCurrent) return -1;
    if (aCurrent > bCurrent) return 1;
    return 0;
}

function getDay(birthdate: string) {
    const currentYear = new Date().getFullYear()
    const dateCurrent = (new Date(birthdate))
    dateCurrent.setFullYear(currentYear)
    if (dateCurrent < new Date()) dateCurrent.setFullYear(currentYear + 1);
    return dagen[dateCurrent.getDay()];
}

const Verjaardagen = () => {

    const {authState: ac, setAuthState} = useContext(AuthContext)

    defaultData.sort((a,b) => sortBirthdays(a.birthdate, b.birthdate))

    return (
        <>
            <PageTitle title="Verjaardagen"/>
            {!ac.isAuthenticated && (
                <p className="verjaardagen_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {ac.isAuthenticated && (
                <div>
                    {defaultData.map((item, index, array) => {
                        if (index == 0 || new Date(item.birthdate).getMonth() > new Date(array[index - 1].birthdate).getMonth()) {
                            return (
                            <>
                                <Maand maand={maanden[new Date(item.birthdate).getMonth()]} />
                                <Verjaardag datum={getDay(item.birthdate) + " " + new Date(item.birthdate).getDate()} voornaam={item.firstname} achternaam={item.lastname} leeftijd={getAge(item.birthdate)}/>
                            </>)
                        }
                        return (<Verjaardag datum={getDay(item.birthdate) + " " + new Date(item.birthdate).getDate()} voornaam={item.firstname} achternaam={item.lastname} leeftijd={getAge(item.birthdate)}/>)
                    }
                        
                    )}
                </div>
                
            )}
        </>
    )
}

export default Verjaardagen;
