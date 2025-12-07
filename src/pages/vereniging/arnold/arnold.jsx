import React from "react";
import PageTitle from "../../../components/PageTitle";
import ArnoldInfo from "./components/ArnoldInfo";
import ArnoldClublied from "./components/ArnoldClublied";
import "../../../components/ContactButtons.scss";
import "./arnold.scss";

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