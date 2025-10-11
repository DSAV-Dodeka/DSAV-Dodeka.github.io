import React, {useContext, useState} from "react";
import AuthContext, { useRenewal} from "../Auth/AuthContext";
import {back_post_auth, type UserData} from "../../functions/api/api";
import "./Profiel.scss";
import { queryError, useProfileQuery } from "../../functions/queries";
import RollenInfo from "../../content/Rollen.json";

const getColor = (role: string) => {
    for (let i = 0; i < RollenInfo.rollen.length; i++) {
        if (RollenInfo.rollen[i].rol === role) {
            return RollenInfo.rollen[i].kleur;
        }
    }
    return "#000000";
}

const getTextColor = (role: string) => {
    for (let i = 0; i < RollenInfo.rollen.length; i++) {
        if (RollenInfo.rollen[i].rol === role) {
            return (RollenInfo.rollen[i].light ? "#000000": "#ffffff");
        }
    }
    return "#ffffff";
}

const defaultData: UserData = {
    firstname: "",
    lastname: "",
    email: "",
    user_id: "",
    joined: "",
    birthdate: "",
}

const Profiel = () => {
    const {authState, setAuthState} = useContext(AuthContext)

    const [newEmail, setNewEmail] = useState("")
    const edit = false
    const setEdit = (v: boolean) => {}
    // TODO enable this after better testing with new version
    //const [edit, setEdit] = useState(false);
    const [editStatus, setEditStatus] = useState("")
    const editStatusClass = editStatus === "Verzonden!" ? "profiel_edit_sent" : "profiel_edit_sent_bad"


    const q = useProfileQuery({authState, setAuthState})
    const profile = queryError(q, defaultData, "User Info Query Error")

    const doRefresh = async () => {
        const newState = await useRenewal(authState)
        setAuthState(newState)
    }

    const handleNewEmailSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        const req = {
            "user_id": authState.username,
            "new_email": newEmail
        }

        try {
            await back_post_auth("update/email/send/", req, {authState, setAuthState})
            setEditStatus("Verzonden!")
        } catch (e) {

        }
    }

    const getRollen = () => {
        const rollen: string[] = [];
        authState.scope.split(" ").forEach((item) => {
            if (item !== "member" && item !== "admin") {
                if (item === "~2eComCom") {
                    rollen.push(".ComCom")
                }
                else if (item === "NSKMeerkamp") {
                    rollen.push(("NSK Meerkamp"))
                }
                else {
                    rollen.push(item)
                }
            }
        }) 
        return rollen;
    }

    return (
        <>
            {!authState.isAuthenticated && (
                <p className="profiel_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}
            {authState.isAuthenticated && (
                <div className="profiel">
                    <p className="profiel_naam">{profile.firstname + " " + profile.lastname}</p>
                    <div className="profiel_role_list">{getRollen().map(item => <p key={item} className="profiel_role_icon" style={{backgroundColor: getColor(item), color: getTextColor(item)}}>{item}</p>)}</div>
                    <p className="profiel_info">Geboortedatum: {new Date(profile.birthdate).getDate() + "/" + (new Date(profile.birthdate).getMonth() + 1) + "/" + new Date(profile.birthdate).getFullYear()}</p>
                    <p className="profiel_info">Lid sinds: {new Date(profile.joined).getDate() + "/" + (new Date(profile.joined).getMonth() + 1) + "/" + new Date(profile.joined).getFullYear()}</p>
                    <div className={edit ? "profiel_hidden" : ""}>
                        <p className="profiel_info">E-mailadres: {profile.email}</p>
                        {/* <div className="profiel_edit" onClick={() => setEdit(true)}>
                            <p className="profiel_edit_text">Wijzig gegevens</p>
                            <svg className="profiel_edit_icon" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 117.74 122.88"><g><path d="M94.62,2c-1.46-1.36-3.14-2.09-5.02-1.99c-1.88,0-3.56,0.73-4.92,2.2L73.59,13.72l31.07,30.03l11.19-11.72 c1.36-1.36,1.88-3.14,1.88-5.02s-0.73-3.66-2.09-4.92L94.62,2L94.62,2L94.62,2z M41.44,109.58c-4.08,1.36-8.26,2.62-12.35,3.98 c-4.08,1.36-8.16,2.72-12.35,4.08c-9.73,3.14-15.07,4.92-16.22,5.23c-1.15,0.31-0.42-4.18,1.99-13.6l7.74-29.61l0.64-0.66 l30.56,30.56L41.44,109.58L41.44,109.58L41.44,109.58z M22.2,67.25l42.99-44.82l31.07,29.92L52.75,97.8L22.2,67.25L22.2,67.25z"/></g></svg>
                        </div> */}
                    </div>
                    <div className={edit ? "" : "profiel_hidden"}>
                        <form className="profiel_edit_info" onSubmit={handleNewEmailSubmit}>
                            <label className="profiel_info" htmlFor="newEmail">E-mailadres:</label>
                            <input className="profiel_input" id="newEmail" placeholder="Nieuwe email" type="text" value={newEmail}
                                   onChange={e => setNewEmail(e.target.value)}/>                        
                            <div className="profiel_edit" onClick={() => setEdit(false)}>
                                <p className="profiel_edit_text">Sluit</p>
                                <svg className="profiel_edit_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460.775 460.775" ><path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/></svg>
                        </div>
                        <button id="newEmailSubmit" className="profiel_button" type="submit">Verzenden</button>
                            <p className={editStatusClass}>{editStatus}</p>
                        </form>
                    </div>
                    {/*<div className="profiel_highlights">*/}
                    {/*    <p>Eastereggs gevonden:</p>*/}
                    {/*    <p>Later deze week beschikbaar</p>*/}
                    {/*</div>*/}
                </div>
            )}
        </>
    )
}

export default Profiel;




