import React from "react";
import PageTitle from "../../../components/PageTitle";
import Bestuursjaar from "./components/Bestuursjaar";
import BestuurText from "../../../content/Bestuur.json";
import "./Bestuur.scss";
import {Logger} from "../../../functions/logger";

function Bestuur() {
    function bart() {
        try {
            Logger.info("bart");
            document.getElementById("bart").classList.remove("hidden");
            document.getElementById("laadBart").classList.add("hidden");
        } catch {}
    }

    return(
        <div>
            <PageTitle title="Bestuur" />
            <div id="bestuurContainer" className="relative space-y-16 lg:space-y-24 pb-16 lg:pb-24">
                {BestuurText.besturen.map(bestuur => 
                    <Bestuursjaar key={"bestuur" + bestuur.jaar} naam={bestuur.naam} jaar={bestuur.jaar} leden={bestuur.leden} foto={bestuur.foto} />
                )}
                <p id="laadBart" onClick={() => bart()}>Laad meer</p>
                <div id="bart" className="hidden">
                    <Bestuursjaar naam="Bestuur 0" jaar="1940/2019" leden={["Bart Groeneveld"]} foto="bestuur_0.jpg"/>
                </div>
            </div>
        </div>
    )
}

export default Bestuur;