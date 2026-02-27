import Maps from "./WedstrijdMaps";
import "./WedstrijdBelangrijk.scss";

interface WedstrijdBelangrijkProps {
  wedstrijd: {
    datum: string;
    tijd?: string;
    locatie?: string;
    adres?: string;
    postcode?: string;
    maps?: string;
    mail?: string;
    instagram?: string;
    bepalingen?: string;
  };
}

function WedstrijdBelangrijk(props: WedstrijdBelangrijkProps) {
    return(
        <div className="belangrijke_info">
            <h1 className="belangrijke_info_titel">Belangrijke informatie</h1>
            <p className="belangrijke_info_text">Datum: {props.wedstrijd.datum}</p>
            {props.wedstrijd.tijd && <p className="belangrijke_info_text">Aanvangstijd: {props.wedstrijd.tijd}</p>}
            {props.wedstrijd.locatie && <p className="belangrijke_info_text">Locatie: {props.wedstrijd.locatie}</p>}
            {props.wedstrijd.adres && <p className="belangrijke_info_text">Adres: {props.wedstrijd.adres}</p>}
            {props.wedstrijd.postcode && <p className="belangrijke_info_text">Postcode: {props.wedstrijd.postcode}</p>}
            {props.wedstrijd.maps && <Maps locatie={props.wedstrijd.maps}/>}
            {("mail" in props.wedstrijd && props.wedstrijd.mail ? <a target="_blank" rel="noreferrer" href={"mailto:" + props.wedstrijd.mail} className="belangrijke_info_button belangrijke_info_mail">Mail</a> : "")}
            {("instagram" in props.wedstrijd && props.wedstrijd.instagram ? <a target="_blank" rel="noreferrer" href={props.wedstrijd.instagram} className="belangrijke_info_button belangrijke_info_insta">Instagram</a> : "")}
            {(props.wedstrijd.bepalingen && props.wedstrijd.bepalingen !== "" ? <a target="_blank" rel="noreferrer" href={props.wedstrijd.bepalingen} className="belangrijke_info_button">Wedstrijdbepalingen</a> : "")}
        </div>
    )
}

export default WedstrijdBelangrijk;