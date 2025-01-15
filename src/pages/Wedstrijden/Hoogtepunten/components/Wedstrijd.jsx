import React, {useContext, useEffect, useState} from "react";
import "./Wedstrijd.scss";
import {getNestedImagesUrl} from "../../../../functions/links";

function getGold(prijzen) {
    const gold = prijzen.filter(prijs => {
        return prijs.plaats === 1
    })
    var res = "";
    gold.forEach((item, index) => res = res + (index !== 0 ? ", " : "") + item.naam + " (" + item.afstand + ")");
    if (res === "") {
        return "-"
    }
    return res;
}

function getSilver(prijzen) {
    const silver = prijzen.filter(prijs => {
        return prijs.plaats === 2
    })
    var res = "";
    silver.forEach((item, index) => res = res + (index !== 0 ? ", " : "") + item.naam + " (" + item.afstand + ")");
    if (res === "") {
        return "-"
    }
    return res;
}

function getBronze(prijzen) {
    const bronze = prijzen.filter(prijs => {
        return prijs.plaats === 3
    })
    var res = "";
    bronze.forEach((item, index) => res = res + (index !== 0 ? ", " : "") + item.naam + " (" + item.afstand + ")");
    if (res === "") {
        return "-"
    }
    return res;
}

function Wedstrijd(props) {
    return (
        <div className="wedstrijd_hoogtepunten">
            <div className="hoogtepunten_wedstrijd">
                {props.naam}
            </div>
            <img className="hoogtepunten_foto" src={getNestedImagesUrl('wedstrijden/' + props.foto)}/>
            
            <div className="hoogtepunten_prijzen">
                <div className="hoogtepunten_titel_container">
                    <p className="hoogtepunten_titel">Prijzen</p>
                </div>
                <div className="hoogtepunten_medaille_container">
                    <img className="hoogtepunten_medaille" src={getNestedImagesUrl('wedstrijden/goud.png')} alt=""/>
                    <img className="hoogtepunten_medaille" src={getNestedImagesUrl('wedstrijden/zilver.png')} alt=""/>
                    <img className="hoogtepunten_medaille" src={getNestedImagesUrl('wedstrijden/brons.png')} alt=""/>
                </div>
                <div className="hoogtepunten_text_container">
                    <p className="hoogtepunten_text">{getGold(props.prijzen)}</p>
                    <p className="hoogtepunten_text">{getSilver(props.prijzen)}</p>
                    <p className="hoogtepunten_text">{getBronze(props.prijzen)}</p>
                </div>
                
            </div>
            <div className="hoogtepunten_divider">
            </div>
            <div className="hoogtepunten_prestaties">
                <div className="hoogtepunten_titel_container">
                    <p className="hoogtepunten_titel">Bijzondere prestaties</p>
                </div>
                <div className="hoogtepunten_prestaties_container">
                    <p className="hoogtepunten_text_prestatie">{props.prestaties[0]}</p>
                    <p className="hoogtepunten_text_prestatie">{props.prestaties[1]}</p>
                    <p className="hoogtepunten_text_prestatie">{props.prestaties[2]}</p>
                </div>
            </div>
        </div>
    )
}

export default Wedstrijd;