import React from "react";
import PageTitle from "../../components/PageTitle";
import OWeeSchema from "./components/OWeeSchema";
import OWeeText from "./components/OWeeText";
import "./OWee.scss";

function OWee() {
    return(
        <div>
            <PageTitle title="OWee"/>
            <OWeeText />
            <OWeeSchema />
        </div>
    )
}

export default OWee;