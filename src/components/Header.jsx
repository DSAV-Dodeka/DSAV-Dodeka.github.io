import React from "react";
import "./Header.scss";

function Header(props) {
    return(
        <div className="header">
            <h1 className={"headerText " + props.position}>
                {props.text.toUpperCase()}
            </h1>
        </div>
    )
}
export default Header;