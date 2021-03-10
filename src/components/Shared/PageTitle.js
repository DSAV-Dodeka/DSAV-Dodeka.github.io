import { PreviousMap } from "postcss";
import React from "react";

function PageTitle(props) {
    return(
        <h1 class="text-left text-5xl text-blauw ml-16 my-8 font-bold">{props.title.toUpperCase()}</h1>
    )
}
export default PageTitle;