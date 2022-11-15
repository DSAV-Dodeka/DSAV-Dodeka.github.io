import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {decodeJwtPayload, TokenError, validateIdToken} from "./functions/OAuth";
import {redirect_uri} from "./AuthRedirect";
import config from "../../config"
import AuthContext, {handleTokenResponse, useLogin} from "./AuthContext";
import {back_post, catch_api, err_api} from "../../functions/api";
import {PagesError} from "../../functions/error";
import {Logger} from "../../functions/logger";


const AuthCallback = () => {
    const navigate = useNavigate()
    const {authState, setAuthState} = useContext(AuthContext)
    const [isSet, changeSet] = useState(false)

    const handleCallback = async (signal: AbortSignal) => {
        let params = (new URLSearchParams(window.location.search))

        let code = params.get("code");
        let loaded_state = params.get("state")

        const ls_state_verify = localStorage.getItem("state_verify")
        if (!ls_state_verify) {
            throw new PagesError("bad_callback", `No state saved.`, 'callback_no_redirect_state')
        }
        const state_verifier = JSON.parse(ls_state_verify)
        if (loaded_state !== state_verifier.state) {
            throw new PagesError("bad_callback", `Callback state ${loaded_state} does not match saved state ${state_verifier.state}`, 'bad_callback_state')
        }

        const token_request = {
            "client_id":  config.client_id,
            "grant_type": "authorization_code",
            "redirect_uri":  redirect_uri,
            "code": code,
            "code_verifier": state_verifier.code_verifier,
        }

        const nonce_original_transient = localStorage.getItem("nonce_original_transient")
        if (nonce_original_transient === null) {
            throw new TokenError("no_nonce_set", "No nonce has been set at redirect!")
        }

        let res;
        try {
            res = await back_post('oauth/token/', token_request, { signal })
        } catch (e) {
            throw await err_api(e)
        }

        const {
            id_payload_raw, id_payload, access_token, refresh_token, scope
        } = await handleTokenResponse(res, nonce_original_transient)

        if (!signal.aborted) {
            localStorage.setItem("nonce_original", nonce_original_transient)
            const newState = useLogin(id_payload_raw, id_payload, access_token, refresh_token, scope)
            Logger.debug({"Callback succesful state": newState})
            setAuthState(newState)
        } else {
            throw new PagesError("abort_error", "Callback aborted in function as token was already received!",
                "abort_callback")
        }
    }

    useEffect(() => {
        Logger.debug("Callback effect...")
        // This ensures first the app loads its previous state, and only then does this load to prevent race conditions
        if (!isSet && authState.isLoaded) {
            Logger.debug("AuthState loaded and running AuthCallback...")

            changeSet(true)

            const ac = new AbortController()

            handleCallback(ac.signal).then(() => {
                navigate("/", { replace: true} )
            }).catch((e) => {
                if (e instanceof PagesError) {
                    Logger.warn(e.j())
                } else if (e.name === 'AbortError') {
                    Logger.warn((new PagesError("abort_error", "Callback aborted as token was already received!",
                        "abort_callback")).j())
                } else {
                    throw e
                }
            });

            return () => {
                ac.abort()
            }
        }

    }, [authState.isLoaded]);

    return (
        <>
        </>
    )
}

export default AuthCallback;