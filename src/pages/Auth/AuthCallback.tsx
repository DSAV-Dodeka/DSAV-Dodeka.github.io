import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {decodeJwtPayload, handleTokenResponse, validateIdToken} from "./functions/OAuth";
import {redirect_uri} from "./AuthRedirect";
import config from "./config"
import AuthContext, {useAuth} from "./AuthContext";


const AuthCallback = () => {
    const navigate = useNavigate()
    const [gotToken, setGotToken] = useState(false);
    const {authState, setAuthState} = useContext(AuthContext)

    const handleCallback = async () => {
        let params = (new URLSearchParams(window.location.search))

        let code = params.get("code");
        let loaded_state = params.get("state")

        const ls_state_verify = localStorage.getItem("state_verify")
        if (!ls_state_verify) {
            return
        }
        const state_verifier = JSON.parse(ls_state_verify)
        if (loaded_state !== state_verifier.state) {
            // abort
            console.log(loaded_state)
            console.log(state_verifier.state)
            console.log("wrong state!")
            //TODO nice abort
            return
        }

        const token_request = {
            "client_id":  config.client_id,
            "grant_type": "authorization_code",
            "redirect_uri":  redirect_uri,
            "code": code,
            "code_verifier": state_verifier.code_verifier,
        }
        const res = await fetch(`${config.auth_location}/oauth/token/`, {
            method: 'POST', body: JSON.stringify(token_request),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // TODO error handling
        await handleTokenResponse(await res.json())

        setGotToken(true)
    }

    useEffect(() => {
        if (!gotToken) {
            handleCallback().catch();
        } else {
            useAuth().then(as => {
                setAuthState(as)
                navigate("/", { replace: true} )
            })
        }
    }, [gotToken]);

    return (
        <>
        </>
    )
}

export default AuthCallback;