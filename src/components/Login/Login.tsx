import React, {useContext, useEffect, useState, useRef} from "react";
import { Link
} from "react-router";
import AuthContext, { useLogout} from "../../pages/Auth/AuthContext";
import {useNavigate} from "react-router";
import "./Login.scss";
import {Logger} from "../../functions/logger";
import { getNestedImagesUrl} from "../../functions/links";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
    const handleClick = (e: MouseEvent) => {
        if (ref !== null && ref.current !== null && !ref.current.contains(e.target as Node)) {
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
    const ref = useRef<HTMLHeadingElement>(null);
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
                <button className="login_button" onClick={handleLogin}><img className="login_icon" src={getNestedImagesUrl(`login/login.webp`)} /></button>
            }
            {ac.isLoaded && ac.isAuthenticated &&
                <div className="profile_dropdown" onClick={() => setActive(!active)}>
                    <h2 ref={ref} className="profile_login"><img className="login_icon" src={getNestedImagesUrl(`login/ingelogd.webp`)} /></h2>
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