import React, {useContext, useState } from "react";
import {
    useLocation, Link
} from "react-router-dom";
import authContext from "../../pages/Auth/AuthContext";
import "./Dropdown.scss";

function Dropdown(props) {
    const location = useLocation().pathname;
    const [active, setActive] = useState(false);
    const {authState, setAuthState} = useContext(authContext);

    return (
        <div id="navDropdown" onMouseLeave={() => setActive(false)}>
            <Link to={props.path + "#"} onMouseEnter={() => setActive(true)} className={"dropdownNav " + (location.includes(props.path) ? "navDropdownActive" : "navDropdownNormal") }>{props.name}</Link>
            <div onClick={() => setActive(false)} className={active ? "drop" : "dropHide"}>
                {props.items.map((item) => (
                    (!item.protected || (authState.isLoaded && authState.isAuthenticated)) && <Link key={"pcDrop" + item.name} to={props.path + item.path + "#"} className={"dropdownElement"}>{item.name}</Link>
                ))}
            </div>
        </div>
    )
}

export default Dropdown;