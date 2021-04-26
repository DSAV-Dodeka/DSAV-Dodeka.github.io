import PageTitle from "../../components/PageTitle";
import Commissie from "./components/Commissie";
import CommissiesText from "../../content/Commissies.json";

function Commissies() {
    return (
        <div>
            <PageTitle title="Commissies" />
            <div class="space-y-24 overflow-x-hidden">
                {CommissiesText.commissies.map((commissie, index) =>
                    <Commissie position={index % 2 === 0 ? "left" : "right"} name={commissie.naam} info={commissie.info} leden={commissie.leden} />
                )}
            </div>
        </div>
    )
}

export default Commissies;