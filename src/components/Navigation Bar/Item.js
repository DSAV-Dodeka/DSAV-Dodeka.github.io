import React from "react";
import {
  useLocation
} from "react-router-dom";
import {
  HashLink as Link
} from "react-router-hash-link";
import "./Item.scss"

function Item(props) {
  const location = useLocation().pathname;

  return (
    <div id="navItem" onClick={props.onClick}>
      <Link to={props.path + "#"} class={"itemNav" + (props.path in ["/vereniging", "/contact"] ? (location.includes(props.path) ? " navItemActive" : " navItemNormal") : (location === props.path ? " navItemActive" : " navItemNormal"))}>{props.name}</Link>
    </div>
  )
}

export default Item;