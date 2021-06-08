import React from "react";
import PageTitle from "../../components/PageTitle";
import Bestuursjaar from "./components/Bestuursjaar";
import BestuurText from "../../content/Bestuur.json";

function Bestuur() {
    function bart() {
        try {
            console.log("bart");
            document.getElementById("bart").classList.remove("hidden");
            document.getElementById("laadbart").classList.add("hidden");
        } catch {}
    }

    return(
        <div>
            <PageTitle title="Bestuur" />
            <div class="relative space-y-16 lg:space-y-24 pb-16 lg:pb-24">
                {BestuurText.besturen.map(bestuur => 
                    <Bestuursjaar naam={bestuur.naam} jaar={bestuur.jaar} leden={bestuur.leden} foto={bestuur.foto} />
                )}
                <p id="laadbart" onClick={() => bart()} class="cursor-default absolute right-0 bottom-0 text-blauw text-opacity-5">Laad meer</p>
                <div id="bart" class="hidden">
                    <Bestuursjaar naam="Bestuur 0" jaar="1940/2019" leden={["Bart Groeneveld"]} foto="bestuur_0.jpg"/>
                </div>
            </div>
        </div>
    )
}

export default Bestuur;