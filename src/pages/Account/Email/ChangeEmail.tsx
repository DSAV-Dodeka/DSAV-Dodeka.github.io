import React, {useContext, useEffect, useState} from "react";
import {back_post, back_post_auth, catch_api} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import {z} from "zod";

const EmailResponse = z.object({
    "old_email": z.string(),
    "new_email": z.string()
})
type EmailResponse = z.infer<typeof EmailResponse>

const ChangeEmail = () => {
    const [load, setLoad] = useState(false)
    const [emails, setEmails] = useState({} as EmailResponse)
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
            const res = await back_post("update/email/check/", req)
            const emails = EmailResponse.parse(res)
            setEmails(emails)

        }
        catch (e) {
            const err = await catch_api(e)
            console.log(JSON.stringify(err))
        }
    }

    useEffect(() => {
        if (!load) {
            handleLoad().catch()
            setLoad(true)
        }
    }, [])

    return (
        <>
            <h1 className="title">Change email</h1>
            {emails.new_email && (<p>Email van account {emails.old_email} is veranderd naar {emails.new_email}!</p>)}
        </>
    )
}

export default ChangeEmail;




