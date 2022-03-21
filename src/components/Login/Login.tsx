import React, {useContext, useEffect, useState} from "react";
import AuthContext, {AuthState} from "../../pages/Auth/AuthContext";
import {useNavigate} from "react-router-dom";


const Login = () => {

    const {authState: ac, setAuthState} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("refresh")
        localStorage.removeItem("access")
        localStorage.removeItem("id_payload")
        const newState = new AuthState()
        newState.isLoaded = true
        setAuthState(newState)
    }

    const handleLogin = () => {
        navigate("/lg")
    }

    return (
        <div className="profile-box">
            {ac.isLoaded && ac.isAuthenticated && `Is logged in as ${ac.user.username}`}
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