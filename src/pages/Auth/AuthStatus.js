import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import config from "./config"


const AuthStatus = () => {
    const [gotToken, setGotToken] = useState(false);

    const handleCallback = async () => {

        setGotToken(true)
    }

    useEffect(() => {
        if (!gotToken) {
            handleCallback().catch();
        }
    }, [gotToken]);

    if (gotToken) {
        return (<Redirect to="/"/>)
    }

    return (
        <>
        </>
    )
}

export default AuthStatus;