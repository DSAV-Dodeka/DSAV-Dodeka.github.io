import PageTitle from "../../../components/PageTitle";
import Donateurs_info from "./components/Donateurs_info";
import Text from "../../../content/Donateurs.json";
import "./donateurs.scss";

function Donateurs() {
  return (
    <div>
      <PageTitle title="Donateurs" />
      <Donateurs_info text={Text.donateurs.tekst} />
    </div>
  );
}

export default Donateurs;
