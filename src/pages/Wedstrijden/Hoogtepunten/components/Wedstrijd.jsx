import React, {useContext, useEffect, useState} from "react";
import "./Wedstrijd.scss";
import foto from "../../../../images/wedstrijden/nsk_indoor_algemeen.jpeg";

function getGold(prijzen) {
    const gold = prijzen.filter(prijs => {
        return prijs.plaats === 1
    })
    var res = "";
    gold.forEach((item, index) => res = res + (index !== 0 ? ", " : "") + item.naam + " (" + item.afstand + ")");
    return res;
}

function getSilver(prijzen) {
    const silver = prijzen.filter(prijs => {
        return prijs.plaats === 2
    })
    var res = "";
    silver.forEach((item, index) => res = res + (index !== 0 ? ", " : "") + item.naam + " (" + item.afstand + ")");
    return res;
}

function getBronze(prijzen) {
    const bronze = prijzen.filter(prijs => {
        return prijs.plaats === 3
    })
    var res = "";
    bronze.forEach((item, index) => res = res + (index !== 0 ? ", " : "") + item.naam + " (" + item.afstand + ")");
    return res;
}

function Wedstrijd(props) {
    return (
        <div className="wedstrijd_hoogtepunten">
            <div className="hoogtepunten_wedstrijd">
                {props.naam}
            </div>
            <img className="hoogtepunten_foto" src={foto}/>
            
            <div className="hoogtepunten_prijzen">
                <p className="hoogtepunten_titel">Prijzen</p>
                <p className="hoogtepunten_text">{"🥇" + getGold(props.prijzen)}</p><br/>
                <p className="hoogtepunten_text">{"🥈" + getSilver(props.prijzen)}</p><br/>
                <p className="hoogtepunten_text">{"🥉" + getBronze(props.prijzen)}</p>
            </div>
            <div className="hoogtepunten_divider">
            </div>
            <div className="hoogtepunten_prestaties">
                <p className="hoogtepunten_titel">Bijzondere prestaties</p>
                <p className="hoogtepunten_text">- Arnold verbetert 60m PR met 12 seconden</p><br/>
                <p className="hoogtepunten_text">- Arnold wint het ludieke onderdeel</p><br/>
                <p className="hoogtepunten_text">- Arnold verbetert 5 PR's</p>
            </div>
        </div>
    )
}

export default Wedstrijd;