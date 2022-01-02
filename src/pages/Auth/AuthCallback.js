import React, {useEffect, useState} from "react";
import PageTitle from "../../components/PageTitle";
import {Redirect} from "react-router-dom";
import { decodeJwtPayload, validateIdToken } from "./functions/OAuth";


const AuthCallback = () => {
    const [gotToken, setGotToken] = useState(false);

    const handleCallback = async () => {
        let params = (new URLSearchParams(window.location.search))

        let code = params.get("code");
        let loaded_state = params.get("state")
        let redirect_uri = "http://localhost:3000/auth/callback"

        const state_verifier = JSON.parse(localStorage.getItem("state_verify"))
        if (loaded_state !== state_verifier.state) {
            // abort
            console.log(loaded_state)
            console.log(state_verifier.state)
            console.log("wrong state!")
            return
        }

        const token_request = {
            "client_id":  "dodekaweb_client",
            "grant_type": "authorization_code",
            "redirect_uri":  redirect_uri,
            "code": code,
            "code_verifier": state_verifier.code_verifier,
        }
        const res = await fetch(`http://localhost:4243/oauth/token/`, {
            method: 'POST', body: JSON.stringify(token_request),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const {
            id_token, access_token, refresh_token, token_type, expires_in, scope
        } = await res.json()
        if (token_type !== "Bearer") {
            console.log("Incorrect token_type!")
        }

        if (expires_in === "x") {

        }
        if (scope === "scope") {

        }
        try {
            const id_payload = await validateIdToken(decodeJwtPayload(id_token))
            localStorage.setItem("access", access_token)
            localStorage.setItem("refresh", refresh_token)
            localStorage.setItem("id_payload", JSON.stringify(id_payload))
        }
        catch (e) {
            console.log(e.message)
        }

        console.log(access_token)
        console.log(refresh_token)
        setGotToken(true)
    }

    useEffect(() => {
        if (!gotToken) {
            handleCallback().catch();
        }
    }, [gotToken]);

    if (gotToken) {
       // Use state to get path to redirect to
        return <Redirect to="/" />
    }

    return (
        <>
            <PageTitle title="AuthCallback" />
            <div>

            </div>
        </>
    )
}

export default AuthCallback;




