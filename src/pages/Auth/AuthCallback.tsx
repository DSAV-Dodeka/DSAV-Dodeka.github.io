import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {decodeJwtPayload, TokenError, validateIdToken} from "./functions/OAuth";
import {redirect_uri} from "./AuthRedirect";
import config from "../../config"
import AuthContext, {handleTokenResponse, useAuth, useLogin} from "./AuthContext";


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
        const nonce_original_transient = localStorage.getItem("nonce_original_transient")
        if (nonce_original_transient === null) {
            throw new TokenError("no_nonce_set", "No nonce has been set at redirect!")
        }
        localStorage.setItem("nonce_original", nonce_original_transient)

        // TODO error handling
        const {
            id_payload_raw, id_payload, access_token, refresh_token, scope
        } = await handleTokenResponse(await res.json())
        const newState = useLogin(id_payload_raw, id_payload, access_token, refresh_token, scope)
        setAuthState(newState)

        setGotToken(true)
    }

    useEffect(() => {
        if (!gotToken) {
            handleCallback().catch();
        } else {
            navigate("/", { replace: true} )
        }
    }, [gotToken]);

    return (
        <>
        </>
    )
}

export default AuthCallback;