import React, {useContext, useEffect, useState} from "react";
import AuthContext from "./AuthContext";


const Protected = () => {

    const {authState, setAuthState} = useContext(AuthContext)

    const [user, setUser] = useState("");
    const [accessScope, setAccessScope] = useState("");

    const setProfile = async () => {
        const access = localStorage.getItem("access")
        console.log(access)
        const refresh = localStorage.getItem("refresh")
        console.log(refresh)
        const bearer = 'Bearer ' + access
        const res = await fetch(`http://localhost:4243/res/profile/`, {
            method: 'GET',
            headers: {
                'Authorization': bearer
            }
        })

        const { username, scope } = await res.json()
        setUser(username)
        setAccessScope(scope)
    }

    useEffect(() => {
        setProfile().catch()
    }, []);

    return (
        <>
            <p>{!authState.isLoaded && "is loading"}</p>
            <p>{authState.isLoaded && "loaded"}</p>
            <div>
                <ul>
                    <li>Username: {user}</li>
                    <li>Access scope: {accessScope}</li>
                </ul>
            </div>
        </>
    )
}

export default Protected;




