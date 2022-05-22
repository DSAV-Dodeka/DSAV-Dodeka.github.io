import React from "react";
import Maps from "./WedstrijdMaps";
import "./WedstrijdBelangrijk.scss";

function WedstrijdBelangrijk(props) {
    return(
        <div className="belangrijke_info">
            <h1 className="belangrijke_info_titel">Belangrijke informatie</h1>
            <p className="belangrijke_info_text">{"Datum: 12/03/2022"}</p>
            <p className="belangrijke_info_text">Aanvangstijd: 11.00 uur</p>
            <p className="belangrijke_info_text">Locatie: Omnisport Apeldoorn</p>
            <p className="belangrijke_info_text">Adres: De Voorwaarts 55</p>
            <p className="belangrijke_info_text">Postcode: 7321 MA Apeldoorn</p>
            <Maps locatie="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.853260909175!2d5.993609751905275!3d52.209714066829875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7b8a7789688dd%3A0xcfd8f969fd9a9f5d!2sOmnisport%20Apeldoorn!5e0!3m2!1snl!2snl!4v1643105966460!5m2!1snl!2snl"/>
            <a target="_blank" rel="noreferrer" href="mailto:nskindoor@dsavdodeka.nl" className="belangrijke_info_button belangrijke_info_mail">Mail</a>
            <a target="_blank" rel="noreferrer" href="https://www.instagram.com/nskindoor22/" className="belangrijke_info_button belangrijke_info_insta">Instagram</a>
            <a target="_blank" rel="noreferrer" href="/files/wedstrijdreglement_nsk_indoor_2022.pdf" className="belangrijke_info_button" download={"Wedstrijdreglement NSK Indoor 2022.pdf"}>Wedstrijdreglement</a>
        </div>
    )
}

export default WedstrijdBelangrijk;