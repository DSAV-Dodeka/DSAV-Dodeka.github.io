import React from "react";
import PageTitle from "../../components/PageTitle";
import ArnoldInfo from "./components/ArnoldInfo";
import ArnoldClublied from "./components/ArnoldClublied";
import "./Arnold.scss";

function Arnold() {
    return(
        <div>
            <PageTitle title="Arnold"/>
            <ArnoldInfo />
            <ArnoldClublied />
        </div>
    )
}

export default Arnold;