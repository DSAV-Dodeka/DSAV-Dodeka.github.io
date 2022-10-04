import React, {useEffect, useState} from "react";
import {binToBase64Url} from "./functions/AuthUtility";
import {computeCodeVerifier, computeRandom, encodedHashBin} from "./functions/OAuth";
import config from "../../config"
import {PagesError} from "../../functions/error";

export const redirect_uri = config.client_location + "/auth/callback"

const AuthRedirect = () => {

    const handleRedirect = async (signal: AbortSignal): Promise<string> => {
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

        if (!signal.aborted) {
            console.log("setStorage")

            localStorage.setItem("state_verify", JSON.stringify(state_verifier))
            localStorage.setItem("nonce_original_transient", nonce_original)

            return `${config.auth_location}/oauth/authorize?` + params
        } else {
            throw new PagesError("abort_error", "Aborted as state for redirect was already generated!",
                "abort_redirect")
        }
    }

    useEffect(() => {
        const ac = new AbortController()
        handleRedirect(ac.signal).then((url) => {
            window.location.replace(url)
        }).catch((e) => {
            if (!(e instanceof PagesError && e.debug_key === "abort_redirect")) {
                throw e
            }
        });

        return () => {
            ac.abort()
        }
    }, []);

    return (
        <>
        </>
    )
}

export default AuthRedirect;