import PageTitle from "../../components/PageTitle";
import React, {useEffect, useState} from "react";


const Profile = () => {

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
            <PageTitle title="Profile" />
            <div>
                <ul>
                    <li>Username: {user}</li>
                    <li>Access scope: {accessScope}</li>
                </ul>
            </div>
        </>
    )
}

export default Profile;




