import React, { useState } from "react";
import {
    useLocation
} from "react-router-dom";
import Item from "./Item";
import "./NavigationBar.css";
import SubMenuItem from "./SubMenuItem";

const regularStyle = "absolute cursor-pointer h-16 lg:h-24 w-full lg:w-32 py-4 lg:py-8 bg-blauw text-center text-white lg:hover:bg-white lg:hover:text-blauw text-2xl font-medium";
const activeStyle = "absolute cursor-pointer h-16 lg:h-24 w-full bg-rood text-white lg:w-32 py-4 lg:py-8 text-center text-2xl font-medium";


function MobileDropdown(props) {
    const location = useLocation().pathname;
    const [active, setActive] = useState(false);

    return (
        <div>
            <div class="h-16 w-full lg:h-24 lg:w-32" onClick={() => setActive(true)}>
                <h class={location.includes(props.path) ? activeStyle : regularStyle} >Over</h>
            </div>
            <div class={"fixed top-0 w-screen h-screen transition duration-500 bg-blauw z-50 transform" + (active ? "" : " translate-x-full")}>
                <div class={active ? "" : "hidden"} onClick={() => setActive(!active)}>
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