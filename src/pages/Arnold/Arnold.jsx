import React from "react";
import PageTitle from "../../components/PageTitle";
import ArnoldInfo from "./components/ArnoldInfo";
import "./Arnold.scss";

function Arnold() {
    return(
        <div>
            <PageTitle title="Arnold"/>
            <ArnoldInfo />
        </div>
    )
}

export default Arnold;