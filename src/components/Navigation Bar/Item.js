import React from "react";
import {
    Link,
    useLocation
} from "react-router-dom";

const regularStyle = "absolute h-24 w-32 py-8 text-center text-white hover:bg-white hover:text-blauw text-2xl font-medium";
const activeStyle = "absolute h-24 bg-rood text-white w-32 py-8 text-center text-2xl font-medium";

function Item(props) {
    const location = useLocation().pathname;
    
    return (
      <div class="relative h-24 w-32">
      <Link to={props.path} class={location === props.path ? activeStyle : regularStyle}>{props.name}</Link>
    </div>
    )
}

export default Item;