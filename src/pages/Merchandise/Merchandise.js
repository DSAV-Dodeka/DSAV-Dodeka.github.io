import PageTitle from "../../components/PageTitle";
import Highlights from "./components/Highlights/Highlights";
import Collectie from "./components/Collectie/Collectie";
import Text from "../../content/Merchandise.json";

function Merchandise() {
    return(
        <div>
            <PageTitle title="Merchandise" />
            <Highlights items={Text.highlights}/>
            <Collectie title="Wedstrijdkleding vrouwen" items={Text.wedstrijdkleding_vrouwen}/>
            <Collectie title="Wedstrijdkleding mannen" items={Text.wedstrijdkleding_mannen}/>
            <Collectie title="Casual kleding" items={Text.casualkleding}/>
        </div>
    )
}

export default Merchandise;