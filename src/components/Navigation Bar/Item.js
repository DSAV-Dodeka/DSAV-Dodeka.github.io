import React from "react";
import {
  Link,
  useLocation
} from "react-router-dom";

const regularStyle = "absolute h-16 lg:h-24 w-full lg:w-32 py-4 lg:py-8 bg-blauw text-center text-white lg:hover:bg-white lg:hover:text-blauw text-2xl font-medium";
const activeStyle = "absolute h-16 lg:h-24 w-full bg-rood text-white lg:w-32 py-4 lg:py-8 text-center text-2xl font-medium";

function Item(props) {
  const location = useLocation().pathname;

  return (
    <div class="h-16 w-full lg:h-24 lg:w-32" onClick={props.onClick}>
      <Link to={props.path} class={location === props.path ? activeStyle : regularStyle}>{props.name}</Link>
    </div>
  )
}

export default Item;