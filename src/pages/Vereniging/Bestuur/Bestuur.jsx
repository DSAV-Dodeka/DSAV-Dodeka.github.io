import React from "react";
import PageTitle from "../../../components/PageTitle";
import Bestuursjaar from "./components/Bestuursjaar";
import BestuurText from "../../../content/Bestuur.json";
import "./Bestuur.scss";

function Bestuur() {

    return(
        <div>
            <PageTitle title="Bestuur" />
            <div id="bestuurContainer" className="relative space-y-16 lg:space-y-24 pb-16 lg:pb-24">
                {BestuurText.besturen.map(bestuur => 
                    <Bestuursjaar key={"bestuur" + bestuur.jaar} naam={bestuur.naam} jaar={bestuur.jaar} leden={bestuur.leden} foto={bestuur.foto} />
                )}
            </div>
        </div>
    )
}

export default Bestuur;