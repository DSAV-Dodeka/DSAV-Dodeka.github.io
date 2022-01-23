import PageTitle from "../../components/PageTitle";
import Commissie from "./components/Commissie";
import CommissiesText from "../../content/Commissies.json";
import "./Commissies.scss";

function Commissies() {
    return (
        <div>
            <PageTitle title="Commissies" />
            <div class="commissies overflow-x-hidden mb-16 lg:mb-24">
                {CommissiesText.commissies.map((commissie, index) =>
                    <Commissie position={index % 2 === 0 ? "left" : "right"} name={commissie.naam} info={commissie.info} leden={commissie.leden} fotos={commissie.fotos}/>
                )}
            </div>
        </div>
    )
}

export default Commissies;