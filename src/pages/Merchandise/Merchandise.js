import PageTitle from "../../components/PageTitle";
import Highlights from "./components/Highlights/Highlights";
import Collectie from "./components/Collectie/Collectie";
import img from "../../images/placeholder.png";

const wedstrijdkleding_vrouwen = [{title: "Sport t-shirt", price: "€15,00", image: img}, {title: "Sport singlet", price: "€15,00", image: img}]
const wedstrijdkleding_mannen = [{title: "Sport t-shirt", price: "€15,00", image: img}, {title: "Sport singlet", price: "€15,00", image: img}]
const casualkleding= [{title: "Trainingsbroek", price: "€20,00", image: img}, {title: "Windjack", price: "€29,00", image: img}, {title: "Hoodie", price: "€20,00", image: img}]

function Merchandise() {
    return(
        <div>
            <PageTitle title="Merchandise" />
            <Highlights/>
            <Collectie title="Wedstrijdkleding vrouwen" items={wedstrijdkleding_vrouwen}/>
            <Collectie title="Wedstrijdkleding mannen" items={wedstrijdkleding_mannen}/>
            <Collectie title="Casual kleding" items={casualkleding}/>
        </div>
    )
}

export default Merchandise;