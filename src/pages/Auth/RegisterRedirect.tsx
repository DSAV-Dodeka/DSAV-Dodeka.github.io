import React, {useEffect, useState} from "react";
import config from "../../config"
import {encryptPass} from "./functions/Key";

const AuthRedirect = () => {

    const [handled, setHandled] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState("")

    const handleRedirect = async () => {
        const source_params = (new URLSearchParams(window.location.search))

        const public_key = source_params.get("public_key");
        const password = localStorage.getItem("register_password")

        const encrypted_pass = await encryptPass(public_key, password)
        localStorage.removeItem("register_password")
        const target_params = new URLSearchParams({
            "encrypted_pass": encrypted_pass,
            "email": source_params.get("email"),
            "register_id": source_params.get("register_id")
        }).toString()

        setRedirectUrl(`${config.auth_location}/credentials/register/?` + target_params)

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