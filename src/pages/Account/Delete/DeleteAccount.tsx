import React, {useContext, useEffect, useState} from "react";
import {back_post, err_api} from "../../../functions/api";
import {z} from "zod";
import {PagesError} from "../../../functions/error";
import AuthContext, {useLogout} from "../../Auth/AuthContext";

const DeleteResponse = z.object({
    "user_id": z.string()
})

const DeleteAccount = () => {
    const [deleted, setDeleted] = useState(false)
    const [deleteError, setDeletedError] = useState(false)
    const {authState, setAuthState} = useContext(AuthContext)


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
            const res = await back_post("update/delete/check/", req, {signal})
            return DeleteResponse.parse(res).user_id
        }
        catch (e) {
            throw await err_api(e)
        }
    }

    useEffect(() => {
        const ac = new AbortController()

        handleLoad(ac.signal).then((del_user_id) => {
            setDeleted(true)
            setDeletedError(false)
            if (authState.username === del_user_id) {
                const newState = useLogout()
                setAuthState(newState)
            }
        }).catch((e) => {
            if (e instanceof PagesError) {
                console.log(e.j())
                if (e.err !== "abort_error") {
                    setDeletedError(true)
                }
            } else if (e.name === 'AbortError') {
                console.log((new PagesError("abort_error", "Aborted as email was already set!",
                    "abort_email_change")).j())
            } else {
                setDeletedError(true)
                throw e
            }
        });

        return () => {
            ac.abort()
        }
    }, [])

    return (
        <>
            <h1 className="title">Delete account</h1>
            {deleteError && (<p>Account is niet verwijderd, er was een error.</p>)}
            {(deleted && !deleteError) && (<p>Account is verwijderd!</p>)}
        </>
    )
}

export default DeleteAccount;




