import React, {useEffect, useState} from "react";
import {back_post, err_api} from "../../../functions/api/api";
import {z} from "zod";
import {PagesError} from "../../../functions/error";

const EmailResponse = z.object({
    "old_email": z.string(),
    "new_email": z.string()
})
type EmailResponse = z.infer<typeof EmailResponse>

const ChangeEmail = () => {
    const [emails, setEmails] = useState({} as EmailResponse)


    const handleLoad = async (signal: AbortSignal) => {
        let code = (new URLSearchParams(window.location.search)).get("code");
        let flow_id = (new URLSearchParams(window.location.search)).get("flow_id");
        if (code === null || flow_id === null) {
            throw new PagesError("bad_email_change", "No code or flow_id set to check email update!", 'bad_flow_code_email_change')
        }
        const req = {
            "code": code,
            "flow_id": flow_id
        }

        try {
            const res = await back_post("update/email/check/", req, {signal})
            return EmailResponse.parse(res)
        }
        catch (e) {
            throw await err_api(e)
        }
    }

    useEffect(() => {
        const ac = new AbortController()

        handleLoad(ac.signal).then(() => {
            setEmails(emails)
        }).catch((e) => {
            if (e instanceof PagesError) {
                console.log(e.j())
            } else if (e.name === 'AbortError') {
                console.log((new PagesError("abort_error", "Aborted as email was already set!",
                    "abort_email_change")).j())
            } else {
                throw e
            }
        });

        return () => {
            ac.abort()
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




