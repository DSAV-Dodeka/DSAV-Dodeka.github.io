import React, {useContext, useEffect, useState} from "react";
import {back_post_auth, catch_api} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";


const ChangeEmail = () => {
    const [load, setLoad] = useState(false)
    const {authState, setAuthState} = useContext(AuthContext)



    const handleLoad = async () => {
        let code = (new URLSearchParams(window.location.search)).get("code");
        let flow_id = (new URLSearchParams(window.location.search)).get("flow_id");
        if (code === null || flow_id === null) {
            return
        }
        const req = {
            "code": code,
            "flow_id": flow_id
        }

        try {
            await back_post_auth("update/email/check/", req, {authState, setAuthState})
        }
        catch (e) {
            const err = await catch_api(e)
            console.log(JSON.stringify(err))
        }
    }

    useEffect(() => {
        if (!load && authState.isAuthenticated) {
            handleLoad().catch()
            setLoad(true)
        }
    }, [authState])

    return (
        <>
            <h1 className="title">Change email</h1>

        </>
    )
}

export default ChangeEmail;




