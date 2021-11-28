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

const Auth = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const hashedPasswordHex = await passwordHash(password, salt)
        const saltHex = toHex(salt)
        //console.log(hashedPasswordHex)
        //console.log(saltHex)
        const code = await computeCodeVerifier()

        //console.log(hashedPassword)
        //console.log(codeVerifier.verifier)
        //console.log(codeVerifier.challenge)
        //const codeChallenge
        const auth_id = await authRequest(username, code.challenge)
        await passRequest(username, hashedPasswordHex, saltHex, auth_id)
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
                    </div>
                    <br /><br />
                        <button id="submit_button" type="submit">Inloggen</button>
                </form>
            </div>
        </>
    )
}

export default Auth;




