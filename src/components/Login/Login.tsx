import React, {useContext, useEffect, useState} from "react";
import {
    useLocation, Link
} from "react-router-dom";
import AuthContext, {AuthState, useLogout} from "../../pages/Auth/AuthContext";
import {useNavigate} from "react-router-dom";
import "./Login.scss";
import Item from "../Navigation Bar/Item";
import Dropdown from "../Navigation Bar/Dropdown";

const Login = () => {
    const [active, setActive] = useState(false);
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
            {ac.isLoaded && !ac.isAuthenticated &&
                <button className="login_button" onClick={handleLogin}>Login</button>
            }
            {ac.isLoaded && ac.isAuthenticated &&
                <div className="profile_dropdown">
                    <h2 className="profile_login" onClick={() => setActive(!active)}>Ingelogd</h2>
                    <div className={active ? "profile_drop" : "dropHide"}>
                        <Link className="profile_dropdownElement" to="/profile">Profiel</Link>
                        {ac.scope.includes("admin") ? (<Link className="profile_dropdownElement" to="/admin">Admin</Link>) : ""}
                        <button className="profile_dropdownElement dropLast" onClick={handleLogout}>Log uit</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Login;