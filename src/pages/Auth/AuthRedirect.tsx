import React, {useEffect, useState} from "react";
import {binToBase64Url} from "./functions/AuthUtility";
import {computeCodeVerifier, computeRandom, encodedHashBin} from "./functions/OAuth";
import config from "../../config"

export const redirect_uri = config.self_location + "/auth/callback"

const AuthRedirect = () => {

    const [handled, setHandled] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState("")

    const handleRedirect = async () => {
        //OAuth Authorization Code Flow + PKCE step 1
        const state = binToBase64Url(crypto.getRandomValues(new Uint8Array(16)))
        const { verifier, challenge } = await computeCodeVerifier()
        //OpenID nonce
        const { encoded_bin: nonce_original, random_bin: nonce_bin } = computeRandom()
        const nonce = await encodedHashBin(nonce_bin)

        const params = new URLSearchParams({
            "response_type": "code",
            "client_id":  config.client_id,
            "redirect_uri":  redirect_uri,
            "state": state,
            "code_challenge": challenge,
            "code_challenge_method": "S256",
            "nonce": nonce,
        }).toString()

        const state_verifier = {
            code_verifier: verifier,
            state
        }
        localStorage.setItem("state_verify", JSON.stringify(state_verifier))
        localStorage.setItem("nonce_original_transient", nonce_original)

        setRedirectUrl(`${config.auth_location}/oauth/authorize?` + params)

        setHandled(true)
    }

    useEffect(() => {
        if (!handled) {
            handleRedirect().catch();
        } else {
            window.location.replace(redirectUrl)
        }
    }, [handled]);

    return (
        <>
        </>
    )
}

export default AuthRedirect;