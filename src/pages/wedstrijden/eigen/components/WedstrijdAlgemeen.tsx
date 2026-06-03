import parse from "html-react-parser";
import "./WedstrijdAlgemeen.scss";
import { getHashedImageUrl } from "$functions/links";

interface WedstrijdAlgemeenProps {
  wedstrijd: {
    foto?: string;
    info_lang?: string;
    info_kort?: string;
    uitslagen?: string;
    inschrijven?: string;
  };
}

function Wedstrijd(props: WedstrijdAlgemeenProps) {
  return (
    <div className="wedstrijd_algemeen">
      {props.wedstrijd.foto && (
        <img
          className="wedstrijd_algemeen_foto"
          alt=""
          src={getHashedImageUrl(`/wedstrijden/${props.wedstrijd.foto}`)}
        />
      )}
      <p className="wedstrijd_algemeen_info">
        {props.wedstrijd.info_lang
          ? parse(props.wedstrijd.info_lang)
          : props.wedstrijd.info_kort || ""}
      </p>
      {"uitslagen" in props.wedstrijd && props.wedstrijd.uitslagen ? (
        <a
          target="_blank"
          rel="noreferrer"
          href={props.wedstrijd.uitslagen}
          className="inschrijf_button"
        >
          Uitslagen
        </a>
      ) : "inschrijven" in props.wedstrijd && props.wedstrijd.inschrijven ? (
        <a
          target="_blank"
          rel="noreferrer"
          href={props.wedstrijd.inschrijven}
          className="inschrijf_button"
        >
          Inschrijven
        </a>
      ) : (
        ""
      )}
    </div>
  );
}

export default Wedstrijd;
