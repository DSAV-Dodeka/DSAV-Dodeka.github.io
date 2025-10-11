import React from "react";
import PageTitle from "../../../components/PageTitle";
import Donateurs_info from "./components/Donateurs_info";
import Text from "../../../content/Donateurs.json";

function Donateurs() {
    return (
        <div>
            <PageTitle title="Donateurs" />
            <Donateurs text={Text.donateurs.tekst} foto={Text.donateurs.foto}/>
        </div>
    )
}

export default Donateurs;