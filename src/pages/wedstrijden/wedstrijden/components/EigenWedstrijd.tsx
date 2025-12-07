import { Link } from "react-router";
import "./EigenWedstrijd.scss";
import { getHashedImageUrl } from "$functions/links";

interface EigenWedstrijdProps {
  naam: string;
  datum: string;
  logo: string;
  info_kort: string;
  path: string;
  oud: boolean;
}

function EigenWedstrijd(props: EigenWedstrijdProps) {
  return (
    <div className={"eigenWedstrijd" + (props.oud ? " eigenWedstrijdOud" : "")}>
      <p className="eigenWedstrijdNaam">{props.naam}</p>
      <p
        className={
          "eigenWedstrijdDatum" + (props.oud ? " eigenWedstrijdDatumOud" : "")
        }
      >
        {props.datum}
      </p>
      <img
        className="eigenWedstrijdFoto"
        src={getHashedImageUrl(`/wedstrijden/${props.logo}`)}
        alt=""
      />
      <p className="eigenWedstrijdInfo">{props.info_kort}</p>
      {props.path === "" ? (
        ""
      ) : (
        <Link to={"/wedstrijden" + props.path}>
          <h1
            className={
              "eigenWedstrijdLink" + (props.oud ? " eigenWedstrijdLinkOud" : "")
            }
          >
            Bekijk wedstrijd
          </h1>
        </Link>
      )}
    </div>
  );
}

export default EigenWedstrijd;
