import React, { useState } from "react";
import {
    useLocation
} from "react-router-dom";
import Item from "./Item";
import SubMenuItem from "./SubMenuItem";
import "./MobileDropdown.scss";

function MobileDropdown(props) {
    const location = useLocation().pathname;
    const [active, setActive] = useState(false);

    return (
        <div>
            <div id="navItem" onClick={() => setActive(true)}>
                <h class={"itemNav " + (location.includes(props.path) ? "navItemActive" : "")} >{props.name}</h>
            </div>
            <div id="mobileDrop" class={"mobileDrop" + (active ? "" : " mobileDropInactive")}>
                <div onClick={() => setActive(!active)}>
                    <SubMenuItem name={props.name} path={props.path} onClick={() => setActive(false)} onItemClick={props.onClick}/>
                    {props.items.map((item) => (
                        <Item name={item.name} path={props.path + item.path} onClick={props.onClick} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MobileDropdown;