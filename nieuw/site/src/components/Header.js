import React from "react";
import "./Header.scss";

function Header(props) {
    return(
        <div class="header">
            <h1 class={"headerText " + props.position}>
                {props.text.toUpperCase()}
            </h1>
        </div>
    )
}
export default Header;