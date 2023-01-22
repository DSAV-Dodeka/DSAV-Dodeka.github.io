import React from "react";
import PageTitle from "../../components/PageTitle";
import "../Wedstrijden/Eigen wedstrijden/Wedstrijd.scss";
import getUrl from "../../functions/links";
import ActiviteitAlgemeen from "./components/ActiviteitAlgemeen";
import ActiviteitBelangrijk from "./components/ActiviteitBelangrijk";

type Activiteit =  {
    wedstrijd: {
        naam: string,
        logo_rond?: string
        foto: string
        info_lang: string,
        uitslagen?: string,
        inschrijven?: string,
        datum: string,
        tijd: string,
        locatie: string,
        adres: string,
        postcode: string,
        maps: string,
        mail: string,
        instagram: string,
        bepalingen?: string
    }
    typePath: "wedstrijden"|"vereniging/activiteiten"
}

function ActiviteitPagina(props: Activiteit) {
    return(
        <div>
            <PageTitle title={props.wedstrijd.naam}/>
            <div className="wedstrijd_container">
                {/*{props.wedstrijd.logo_rond === "" ? "" : <img className="wedstrijd_logo" src={getUrl(`${props.typePath}/${props.wedstrijd.logo_rond}`)} alt =""/>}*/}
                <ActiviteitAlgemeen wedstrijd={props.wedstrijd} typePath={props.typePath}/>
                <ActiviteitBelangrijk wedstrijd={props.wedstrijd}/>
            </div>
        </div>
    )
}

export default ActiviteitPagina;