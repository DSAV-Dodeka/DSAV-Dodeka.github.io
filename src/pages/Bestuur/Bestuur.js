import React from "react";
import PageTitle from "../../components/PageTitle";
import Bestuursjaar from "./components/Bestuursjaar";
import BestuurText from "../../content/Bestuur.json";

function Bestuur() {
    return(
        <div>
            <PageTitle title="Bestuur" />
            <div class="space-y-16 pb-16">
                {BestuurText.besturen.map(bestuur => 
                    <Bestuursjaar naam={bestuur.naam} jaar={bestuur.jaar} leden={bestuur.leden} foto={bestuur.foto} />
                )}
            </div>
        </div>
    )
}

export default Bestuur;