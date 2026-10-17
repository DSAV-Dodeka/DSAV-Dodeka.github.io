import PageTitle from "../../components/PageTitle";
import OWeeSchema from "./components/OWeeSchema";
import OWeeInteresse from "./components/OWeeInteresse";
import OWeeText from "./components/OWeeText";
import OWeeImageBar from "./components/OWeeImageBar";
import "./owee.scss";

function OWee() {
    return(
        <div>
            <PageTitle title="OWee"/>
            <OWeeSchema />
            <OWeeInteresse />
            <OWeeText />
            <OWeeImageBar />
        </div>
    )
}

export default OWee;