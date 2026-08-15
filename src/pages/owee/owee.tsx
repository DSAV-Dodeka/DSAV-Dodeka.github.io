import PageTitle from "../../components/PageTitle";
import OWeeSchema from "./components/OWeeSchema";
import OWeeText from "./components/OWeeText";
import OWeeImageBar from "./components/OWeeImageBar";
import "./owee.scss";

function OWee() {
    return(
        <div>
            <PageTitle title="OWee"/>
            <OWeeSchema />  
            <OWeeText />
            <OWeeImageBar />
        </div>
    )
}

export default OWee;