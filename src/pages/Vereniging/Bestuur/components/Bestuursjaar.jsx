import React from "react";
import Header from "../../../../components/Header";
import "./Bestuursjaar.scss";
import getUrl from "../../../../functions/links";

function Bestuursjaar(props) {
    return(
        <div id="bestuursjaarContainer">
            <div id="bestuursjaarLeft">
                <div id="bestuurHeaderContainer">
                    <Header text={props.naam} position="right"/>
                </div>
                <img id="bestuurFoto" src={getUrl(`bestuur/${props.foto}`)} alt=""/>
                
            </div>
            <div id="bestuursjaarRight">
                <div className="bestuursjaarLeden">
                    {props.leden.map(lid =>
                        <>
                            <h1 key={props.jaar + lid[0]} class="bestuurLid_naam">{lid[0]}</h1>
                            <h1 key={props.jaar + lid[1]} class="bestuurLid_functie">{lid[1]}</h1>
                        </>
                    )}
                </div>
                <h1 id="jaarBestuur">{props.jaar}</h1>
            </div>
            <div id="line1" className="line vertical"/>
            <div id="line2" className="line vertical"/>
            <div id="line3" className="line vertical"/>
            <div id="line4" className="line horizontal"/>
            <div id="line5" className="line horizontal"/>
            <div id="line6" className="line horizontal"/>
        </div>
    )
}

export default Bestuursjaar;