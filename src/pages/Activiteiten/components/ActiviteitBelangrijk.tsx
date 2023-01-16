import React from "react";
import "../../Wedstrijden/Eigen wedstrijden/components/WedstrijdBelangrijk.scss";
import Maps from "../../Wedstrijden/Eigen wedstrijden/components/WedstrijdMaps";

type ActiviteitBelangrijk =  {
    wedstrijd: {
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
}
function WedstrijdBelangrijk(props: ActiviteitBelangrijk) {
    return(
        <div className="belangrijke_info">
            <h1 className="belangrijke_info_titel">Belangrijke informatie</h1>
            <p className="belangrijke_info_text">Datum: {props.wedstrijd.datum}</p>
            <p className="belangrijke_info_text">Aanvangstijd: {props.wedstrijd.tijd}</p>
            <p className="belangrijke_info_text">Locatie: {props.wedstrijd.locatie}</p>
            <p className="belangrijke_info_text">Adres: {props.wedstrijd.adres}</p>
            <p className="belangrijke_info_text">Postcode: {props.wedstrijd.postcode}</p>
            <Maps locatie={props.wedstrijd.maps}/>
            <a target="_blank" rel="noreferrer" href={"mailto:" + props.wedstrijd.mail} className="belangrijke_info_button belangrijke_info_mail">Mail</a>
            <a target="_blank" rel="noreferrer" href={props.wedstrijd.instagram} className="belangrijke_info_button belangrijke_info_insta">Instagram</a>
            {(props.wedstrijd.bepalingen === "" ? "" : <a target="_blank" rel="noreferrer" href={props.wedstrijd.bepalingen} className="belangrijke_info_button">Wedstrijdbepalingen</a>)}
        </div>
    )
}

export default WedstrijdBelangrijk;