import React, { useState } from "react";
import {
    useLocation
} from "react-router";
import Item from "./Item";
import SubMenuItem from "./SubMenuItem";
import "./MobileDropdown.scss";

function MobileDropdown(props) {
    const location = useLocation().pathname;
    const [active, setActive] = useState(false);

    return (
        <div>
            <div className="navItem dropdown_relative" onClick={() => setActive(true)}>
                <h1 className={"itemNav " + (location.includes(props.path) ? "navItemActive" : "")} >{props.name}</h1>
                <svg id="dropdown_arrow" className="absolute top-4 left-4 z-20 w-8 text-center text-white stroke-current self-center cursor-pointer" viewBox="0 0 32 32">
                    <path d="M8 8 L16 16 L8 24" fill="none" strokeWidth="4" />
                </svg>
            </div>
            <div id="mobileDrop" className={"mobileDrop" + (active ? "" : " mobileDropInactive")}>
                <div onClick={() => setActive(!active)}>
                    <SubMenuItem name={props.name} path={props.path} onClick={() => setActive(false)} onItemClick={props.onClick}/>
                    {props.items.map((item) => (
                        <Item key={"drop" + item.name} name={item.name} path={props.path + item.path} onClick={props.onClick} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MobileDropdown;