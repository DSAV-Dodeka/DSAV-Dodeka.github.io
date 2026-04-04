import PageTitle from "../../../components/PageTitle";
import WedstrijdAlgemeen from "./components/WedstrijdAlgemeen.tsx";
import WedstrijdBelangrijk from "./components/WedstrijdBelangrijk.tsx";
import "./Wedstrijd.scss";
import { getHashedImageUrl } from "../../../functions/links";
import type { Wedstrijd } from "$functions/wedstrijden.ts";

interface WedstrijdProps {
  wedstrijd: Wedstrijd;
}

function Wedstrijd(props: WedstrijdProps) {
  return (
    <div>
      <PageTitle title={props.wedstrijd.naam} />
      <div className="wedstrijd_container">
        {props.wedstrijd.logo_rond && props.wedstrijd.logo_rond !== "" ? (
          <img
            className="wedstrijd_logo"
            src={getHashedImageUrl(`wedstrijden/${props.wedstrijd.logo_rond}`)}
            alt=""
          />
        ) : null}
        <WedstrijdAlgemeen wedstrijd={props.wedstrijd} />
        <WedstrijdBelangrijk wedstrijd={props.wedstrijd} />
      </div>
    </div>
  );
}

export default Wedstrijd;
