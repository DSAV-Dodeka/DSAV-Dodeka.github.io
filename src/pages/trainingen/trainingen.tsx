import PageTitle from "../../components/PageTitle";
import Trainingstijden from "./components/Trainingstijden";
import Trainingsinfo from "./components/Trainingsinfo";
import Icons from "./components/Icons";
import Baanatletiek from "./components/Baanatletiek";
import Loopgroep from "./components/Loopgroep";
import Text from "../../content/Trainingen.json";

function Trainingen() {
  return (
    <div>
      <PageTitle title="Trainingen" />
      <Trainingstijden />
      <Trainingsinfo text={Text.algemeen.tekst} />
      <Baanatletiek text={Text.baanatletiek.tekst} />
      <Icons />
      <Loopgroep text={Text.loopgroep.tekst} />
    </div>
  );
}

export default Trainingen;
