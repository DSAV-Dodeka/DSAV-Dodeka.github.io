import React, { useState } from "react";
import {
    Link,
    useLocation
} from "react-router-dom";

const regularStyle = "absolute h-16 lg:h-24 w-full lg:w-32 py-4 lg:py-8 bg-blauw text-center text-white hover:bg-white hover:text-blauw text-2xl font-medium";
const activeStyle = "absolute h-16 lg:h-24 w-full bg-rood text-white lg:w-32 py-4 lg:py-8 text-center text-2xl font-medium";
const dropdownStyle = "block h-16 py-4 w-32 text-center text-white bg-blauw text-white border-white hover:bg-white hover:text-blauw text-lg font-medium";

function Dropdown(props) {
    const location = useLocation().pathname;
    const [active, setActive] = useState(false);

    return (
        <div onMouseLeave={() => setActive(false)} class="relative h-24 w-32">
            <Link to={props.path} onMouseEnter={() => setActive(true)} class={location.includes(props.path) ? activeStyle : regularStyle}>{props.name}</Link>
            <div onClick={() => setActive(false)} class={active ? "absolute left-0 w-32 top-24 z-50" : "hidden"}>
                {props.items.map((item, index) => (
                    <Link to={props.path + item.path} class={index === props.items.length - 1 ? dropdownStyle + " rounded-b-md" : dropdownStyle}>{item.name}</Link>
                ))}
            </div>
        </div>
    )
}

export default Dropdown;