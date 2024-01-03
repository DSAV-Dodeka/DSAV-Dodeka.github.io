import React from "react";
import PageTitle from "../../components/PageTitle";
import OWeeSchema from "./components/OWeeSchema";
import OWeeText from "./components/OWeeText";
import OWeeImageBar from "./components/OWeeImageBar";
import "./Lustrum.scss";

function Lustrum() {
    return(
        <div>
            <PageTitle title="Lustrum"/>
            <OWeeText />
            <OWeeImageBar />
            <OWeeSchema />
        </div>
    )
}

export default Lustrum;