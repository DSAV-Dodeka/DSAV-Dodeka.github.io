import PageTitle from "../../components/PageTitle";
import Commissie from "./components/Commissie";

function Commissies() {
    return(
        <div>
            <PageTitle title="Commissies" />
            <div class="space-y-24">
            <Commissie position="left" name=".ComCom"/>
            <Commissie position="right" name=".ComCo"/>
            </div>
            
        </div>
    )
}

export default Commissies;