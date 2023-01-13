import React, {useContext, useEffect, useState, useRef} from "react";
import {
    useLocation, Link
} from "react-router-dom";
import AuthContext, {AuthState, useLogout} from "../../pages/Auth/AuthContext";
import {useNavigate} from "react-router-dom";
import "./Login.scss";
import Item from "../Navigation Bar/Item";
import Dropdown from "../Navigation Bar/Dropdown";
import {Logger} from "../../functions/logger";
import getUrl from "../../functions/links";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick(ref, callback) {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    }
    useEffect(() => {
      // Bind the event listener
      document.addEventListener("click", handleClick);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("click", handleClick);
      };
    });
}



const Login = () => {
    const [active, setActive] = useState(false);
    const {authState: ac, setAuthState} = useContext(AuthContext)
    const navigate = useNavigate()
    const ref = useRef();
    useOutsideClick(ref, () => {
        setActive(false)
    })

    const handleLogin = () => {
        navigate("/lg")
    }

    const handleLogout = () => {
        Logger.debug("Logging out from button...")
        const newState = useLogout(ac)
        setAuthState(newState)
        navigate("/")
    }

    return (
        <div  className="profile-box">
            {ac.isLoaded && !ac.isAuthenticated &&
                <button className="login_button" onClick={handleLogin}><img className="login_icon" src={getUrl(`login/login.png`)} /></button>
            }
            {ac.isLoaded && ac.isAuthenticated &&
                <div className="profile_dropdown" onClick={() => setActive(!active)}>
                    <h2 ref={ref} className="profile_login"><img className="login_icon" src={getUrl(`login/ingelogd.png`)} /></h2>
                    <div className={active ? "profile_drop" : "dropHide"}>
                        <Link className="profile_dropdownElement" to="/profiel">Profiel</Link>
                        {ac.scope.includes("admin") ? (<Link className="profile_dropdownElement" to="/admin">Admin</Link>) : ""}
                        <button className="profile_dropdownElement dropLast" onClick={handleLogout}>Log uit</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Login;