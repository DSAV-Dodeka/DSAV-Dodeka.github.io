import React from "react";
import parse from "html-react-parser";
import "../../Wedstrijden/Eigen wedstrijden/components/WedstrijdAlgemeen.scss";
import getUrl from "../../../functions/links";



type ActiviteitAlgemeen =  {
    wedstrijd: {
        foto: string
        info_lang: string,
        uitslagen?: string,
        inschrijven?: string
    }
    typePath: "wedstrijden"|"vereniging/activiteiten"
}
function ActiviteitAlgemeen(props: ActiviteitAlgemeen) {
    return(
        <div className="wedstrijd_algemeen">
            <img className="wedstrijd_algemeen_foto2" alt="" src={getUrl(`${props.typePath}/${props.wedstrijd.foto}`)}/>
            <p className="wedstrijd_algemeen_info">{parse(props.wedstrijd.info_lang)}</p>
            {("uitslagen" in props.wedstrijd ? <a target="_blank" rel="noreferrer" href={props.wedstrijd.uitslagen} className="inschrijf_button">Uitslagen</a> : ("inschrijven" in props.wedstrijd ? <a target="_blank" rel="noreferrer" href={props.wedstrijd.inschrijven} className="inschrijf_button">Inschrijven</a> : "" ))}

        </div>
    )
}

export default ActiviteitAlgemeen;