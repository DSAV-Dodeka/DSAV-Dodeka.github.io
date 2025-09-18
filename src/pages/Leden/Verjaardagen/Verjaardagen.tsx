import React, {useContext} from "react";
import AuthContext from "../../Auth/AuthContext";
import PageTitle from "../../../components/PageTitle";
import {type BirthdayData} from "../../../functions/api/api";
import Maand from "./components/Maand";
import Verjaardag from "./components/Verjaardag";
import "./Verjaardagen.scss";
import {queryError, useBirthdayDataQuery} from "../../../functions/queries";

const maanden = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
const dagen = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"]

const defaultData: BirthdayData[] = [
    {
        firstname: "Arnold",
        lastname: "het Aardvarken",
        birthdate: "2019-02-25"
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

    //const {authState: ac, setAuthState} = useContext(AuthContext)
    const {authState, setAuthState} = useContext(AuthContext)

    const q = useBirthdayDataQuery({ authState, setAuthState })
    const data = queryError(q, defaultData, "User Info Query Error")

    data.sort((a,b) => sortBirthdays(a.birthdate, b.birthdate))

    return (
        <>
            <PageTitle title="Verjaardagen"/>
            {!authState.isAuthenticated && (
                <p className="verjaardagen_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {authState.isAuthenticated && (
                <div className="verjaardagen_container">
                    {data.map((item, index, array) => {
                        const datum = getDay(item.birthdate) + " " + new Date(item.birthdate).getDate()
                        const vkey = datum + item.firstname + item.lastname

                        if (index == 0 || new Date(item.birthdate).getMonth() !== new Date(array[index - 1].birthdate).getMonth()) {
                            const maand = maanden[new Date(item.birthdate).getMonth()]

                            return (
                            <div key={maand + vkey} className="verjaardagen_contents">
                                <Maand key={maand} maand={maand} />
                                <Verjaardag key={vkey} dag={new Date(item.birthdate).getDate()} datum={datum} voornaam={item.firstname} achternaam={item.lastname} leeftijd={getAge(item.birthdate)}/>
                            </div>)
                        }
                        return (<Verjaardag key={vkey} dag={new Date(item.birthdate).getDate()} datum={datum} voornaam={item.firstname} achternaam={item.lastname} leeftijd={getAge(item.birthdate)}/>)
                    })}
                </div>

            )}
        </>
    )
}

export default Verjaardagen;
