import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthState, useLogout} from "../../pages/Auth/AuthContext";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const {authState: ac, setAuthState} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate("/lg")
    }

    const handleLogout = () => {
        const newState = useLogout()
        console.log(newState)
        setAuthState(newState)
    }

    return (
        <div className="profile-box">
            {ac.isLoaded && ac.isAuthenticated && `Is logged in as ${ac.username}`}
            {ac.isLoaded && !ac.isAuthenticated &&
                <button onClick={handleLogin}>Login</button>
            }
            {ac.isLoaded && ac.isAuthenticated &&
                <button onClick={handleLogout}>Logout</button>
            }
        </div>
    )
}

export default Login;