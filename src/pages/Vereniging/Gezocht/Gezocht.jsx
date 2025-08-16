import React from "react";
import PageTitle from "../../../components/PageTitle";
import Trainersgezocht from "./components/Trainersgezocht";
import Text from "../../../content/Gezocht.json";

function Gezocht() {
    return (
        <div>
            <PageTitle title="Trainers gezocht" />
            <Trainersgezocht text={Text.gezocht.tekst} foto={Text.gezocht.foto}/>
        </div>
    )
}

export default Gezocht;