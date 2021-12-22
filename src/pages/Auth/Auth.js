import PageTitle from "../../components/PageTitle";
import React, { useState } from "react";

function toHex(byte_array) {
    const arr = Array.from(new Uint8Array(byte_array));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Adapted from previous project
async function passwordHash(password, salt) {
    let enc = new TextEncoder();
    const keyMaterial = crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    const derivedBuffer = await crypto.subtle.deriveBits(
        {
            "name": "PBKDF2",
            salt: salt,
            "iterations": 1000000,
            "hash": "SHA-256"
        },
        await keyMaterial,
        256
    );

    return toHex(derivedBuffer)
}

function binToBase64url(byte_array) {
    const random_chrpts = Array.from(byte_array).map((num) => {
        return String.fromCharCode(num)
    }).join('')
    return btoa(random_chrpts)
        .replaceAll("/", "_").replaceAll("+", "-").slice(0, 43)
}

async function computeCodeVerifier() {
    // Random value encoded as Base64url
    const random_bin = crypto.getRandomValues(new Uint8Array(32))
    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", random_bin))
    const verifier = binToBase64url(random_bin)
    const challenge = binToBase64url(hash)

    return { verifier, challenge }
}

async function passRequest(username, hashedPassword, saltHex) {

}

async function authRequest(username, challenge) {
    const state = binToBase64url(crypto.getRandomValues(new Uint8Array(16)))

    const reqst = {
        "response_type": "code",
        "client_id":  "dodekaweb",
        "redirect_uri":  "http://localhost:3000/auth",
        "state": state,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
    }
    const res = await fetch(`http://localhost:4242/auth/${username}`, {
        method: 'POST', body: JSON.stringify(reqst),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const parsed = await res.json()
    console.log(parsed.auth_id)
    return parsed.auth_id
}

async function clientRegister(password) {
    const opaque = await import("@tiptenbrink/opaquewasm")
    try {
        //step 1
        const arr = opaque.client_register_wasm(password);
        const message1 = arr[0];
        const state = arr[1];

        console.log(message1)
        console.log(state)

        // get server message from back end

        // step 2
        // password 'abc'
        const message2 = opaque.client_register_finish_wasm("HOqqdRYhiUDCYdEFt224RopWkUyh_bpAOulzXDk7CQeh0_UaT_9jsWAnAxxoxha2ZnFHQAiqLwFHKogQXblAD2FiYw==",
            "3OoePgOwxP0k4Tqn5Cic_6EtcbKb2aAzd7EfZF0ua0j8cilJ2k3wlBxI5tG-aPV_-VNMoit3BFUK-8zO6cYpdA==")

        console.log(message2)

        // send message to server

    } catch (e) {
        console.log(e)
    }
}

async function clientLogin(password) {
    const opaque = await import("@tiptenbrink/opaquewasm")
    try {
        const arr = opaque.client_login_wasm(password)
        const message1 = arr[0];
        const state = arr[1];

        console.log(message1)
        console.log(state)

        // get message to server and get message back

        // pass 'abc'
        const login_state = "Gg6GSd_2X9ccTkVZBatUyynmRM5CWBVh9j8Fsac2hQAAYoxXlNs3YTKM_4eq-Tr3hOM5TO1OZTaAgI7DYQIV4rhX-EomurCCwcw3cojfbBudPS6aF0YyxJZYbjgD8ABTigIAAMaJ77uRiMGm50uF6_VEFchFlKmwvKhhiUUsRhZhRl1fAEChX0fsJTWoEsS2bPTSt-1BKlRkL85rlA1yZkr56BWbCvhKJrqwgsHMN3KI32wbnT0umhdGMsSWWG44A_AAU4oCYWJj"
        const server_message = "ho_5N1Kup16z2J_aoR3MxLpxrM--gE-AFLz8-bhkIh_8cilJ2k3wlBxI5tG-aPV_-VNMoit3BFUK-8zO6cYpdAETrMqI8STeP2akP4qAmQ8A5nAFshWJUpU3NfznjqXFTFPMQRJAaV9Ga-xnDUXd7KTkW18gQeoI_QWXN9xgYaFJHsYTVOYXoWKkoOwbHfurl9tNesy7DhgOnFvBH7rxH3-i3Xcl4lPuHtFFlgNCLwR4r1V0wH9tFSGC30LmXpZOBLWWZ0IXIl5BBZ5mSCJJHS9UKiYIYAHjsDjpeMQaRm_0PA70Xqrlk1dLmlhrWSoX46pZQ3Bxp2bKxF38mtr3MQcAAO3RwD2P-EutfATHdQ2W1qQZuJyOjG255FSAsbBLIOFBcpYBCNIitdoxYe7baP6gI_A9LxyK4kP0kOXg17sQ8wQ="

        const message2 = opaque.client_login_finish_wasm(login_state, server_message)

        console.log(message2)

    } catch (e) {
        console.log(e)
    }
}

const Auth = () => {



    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isRegister, setIsRegister] = useState(false)

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        // const x = opaque.send_string('a', 'b')
        // console.log(x)

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const hashedPasswordHex = await passwordHash(password, salt)
        const saltHex = toHex(salt)
        //console.log(hashedPasswordHex)
        //console.log(saltHex)
        const code = await computeCodeVerifier()

        if (isRegister) {
            await clientRegister(password)
        }
        else {
            await clientLogin(password)
        }


        //console.log(hashedPassword)
        //console.log(codeVerifier.verifier)
        //console.log(codeVerifier.challenge)
        //const codeChallenge

        // const auth_id = await authRequest(username, code.challenge)
        // await passRequest(username, hashedPasswordHex, saltHex, auth_id)
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
                        <input type='checkbox' placeholder="ja als registreren" value={isRegister}
                               onChange={e => setIsRegister(e.target.value)}/>
                    </div>
                    <br /><br />
                        <button id="submit_button" type="submit">Inloggen</button><br />
                </form>
            </div>
        </>
    )
}

export default Auth;




