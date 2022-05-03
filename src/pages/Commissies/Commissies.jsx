import PageTitle from "../../components/PageTitle";
import Commissie from "./components/Commissie";
import CommissiesText from "../../content/Commissies.json";
import "./Commissies.scss";

function Commissies() {
    return (
        <div>
            <div className="commissies_huidig">
                <PageTitle title="Commissies" />
                <div className="commissies">
                    {CommissiesText.commissies.map((commissie, index) =>
                        <Commissie key={commissie.naam} position={index % 2 === 0 ? "left" : "right"} name={commissie.naam} info={commissie.info} leden={commissie.leden} fotos={commissie.fotos}/>
                    )}
                </div>
            </div>
            <PageTitle title="Commissies 2020-2021" />
            <div className="commissies">
                {CommissiesText.commissies_oud.map((commissie, index) =>
                    <Commissie key={commissie.naam} position={index % 2 === 0 ? "left" : "right"} name={commissie.naam} info={commissie.info} leden={commissie.leden} fotos={commissie.fotos}/>
                )}
            </div>
        </div>
    )
}

export default Commissies;