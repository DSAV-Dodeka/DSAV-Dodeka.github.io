import React from "react";
import Header from "../../../components/Header";
import Maps from "./WedstrijdMaps";
import "./WedstrijdBelangrijk.scss";

function WedstrijdBelangrijk(props) {
    return(
        <div className="belangrijke_info">
            <Header text="Belangrijke Informatie" />
            <p className="belangrijke_info_text">Datum: 12/03/2022</p>
            <p className="belangrijke_info_text">Aanvangstijd: 11.00 uur</p>
            <p className="belangrijke_info_text">Locatie: Omnisport<br/> &emsp;&emsp;&emsp;&ensp;&nbsp; De Voorwaarts 55 <br/> &emsp;&emsp;&emsp;&ensp;&nbsp;7321 MA Apeldoorn</p>
            <Maps locatie="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.853260909175!2d5.993609751905275!3d52.209714066829875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7b8a7789688dd%3A0xcfd8f969fd9a9f5d!2sOmnisport%20Apeldoorn!5e0!3m2!1snl!2snl!4v1643105966460!5m2!1snl!2snl"/>
            <a target="_blank" rel="noreferrer" href="https://www.atletiek.nu/wedstrijd/main/36345/" className="belangrijke_info_button">Inschrijven</a>
            <a target="_blank" rel="noreferrer" href="#" className="belangrijke_info_button">Wedstrijdreglement</a>
        </div>
    )
}

export default WedstrijdBelangrijk;