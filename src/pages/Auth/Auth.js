import PageTitle from "../../components/PageTitle";
import React, { useState } from "react";
import { clientLogin, clientRegister } from "./functions/Authenticate";


const Auth = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isRegister, setIsRegister] = useState(false)

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        if (isRegister) {
            const is_ok = await clientRegister(username, password)
        }
        // login
        else {
            let flow_id = (new URLSearchParams(window.location.search)).get("flow_id");
            const code = await clientLogin(username, password, flow_id)

            if (code === undefined || code == null) {
                return
            }

            const params = new URLSearchParams({
                flow_id,
                code
            })

            const redirectUrl = "http://localhost:4243/oauth/callback?" + params.toString()
            window.location.assign(redirectUrl)
        }
    }

    return (
        <>
            <PageTitle title="Auth" />
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Gebruikersnaam</label><span>&nbsp;</span>
                        <input id="username" placeholder="uw E-mail/DodekaID" type="text" value={username}
                               onChange={e => setUsername(e.target.value)}/>

                            <label>Wachtwoord</label><span>&nbsp;</span>
                            <input type="password" placeholder="uw wachtwoord" value={password}
                                   onChange={e => setPassword(e.target.value)} />
                        <input type='checkbox' placeholder="ja als registreren" checked={isRegister}
                               onChange={e => setIsRegister(e.target.checked)}/>
                    </div>
                    <br /><br />
                        <button id="submit_button" type="submit">Inloggen</button><br />
                </form>
            </div>
        </>
    )
}

export default Auth;




