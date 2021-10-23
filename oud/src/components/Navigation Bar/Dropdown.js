import React, { useState } from "react";
import {
    useLocation
} from "react-router-dom";
import {
    HashLink as Link
  } from "react-router-hash-link";

const regularStyle = "absolute h-16 w-full lg:w-32 py-4 bg-blauw text-center text-white hover:bg-white hover:text-blauw text-xl font-medium";
const activeStyle = "absolute h-16 w-full bg-rood text-white lg:w-32 py-4 text-center text-xl font-medium";
const dropdownStyle = "block h-16 py-4 w-32 text-center text-white bg-blauw text-white border-white hover:bg-white hover:text-blauw text-lg font-medium";

function Dropdown(props) {
    const location = useLocation().pathname;
    const [active, setActive] = useState(false);

    return (
        <div onMouseLeave={() => setActive(false)} class="relative h-16 w-32">
            <Link to={props.path + "#"} onMouseEnter={() => setActive(true)} class={location.includes(props.path) ? activeStyle : regularStyle}>{props.name}</Link>
            <div onClick={() => setActive(false)} class={active ? "absolute left-0 w-32 top-16 z-50" : "hidden"}>
                {props.items.map((item, index) => (
                    <Link to={props.path + item.path + "#"} class={index === props.items.length - 1 ? dropdownStyle + " rounded-b-md" : dropdownStyle}>{item.name}</Link>
                ))}
            </div>
        </div>
    )
}

export default Dropdown;