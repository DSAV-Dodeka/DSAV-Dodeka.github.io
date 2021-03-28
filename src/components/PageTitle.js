import React from "react";

function PageTitle(props) {
    return(
        <h1 class="text-left text-3xl lg:text-5xl text-blauw ml-4 lg:ml-16 my-4 lg:my-8 font-bold">{props.title.toUpperCase()}</h1>
    )
}
export default PageTitle;