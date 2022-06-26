import React from "react";
import "./PageTitle.scss";

function PageTitle(props) {
    return(
        <h1 id="page">{props.title.toUpperCase()}</h1>
    )
}
export default PageTitle;