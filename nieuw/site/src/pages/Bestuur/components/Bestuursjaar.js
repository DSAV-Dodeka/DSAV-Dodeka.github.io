import React from "react";
import Header from "../../../components/Header";
import "./Bestuursjaar.scss";

function Bestuursjaar(props) {
    return(
        <div id="bestuursjaarContainer">
            <div id="bestuursjaarLeft">
                <div id="bestuurHeaderContainer">
                    <Header text={props.naam} position="right"/>
                </div>
                <img id="bestuurFoto" src={require(`../../../images/bestuur/${props.foto}`).default} alt=""/>
                
            </div>
            <div id="bestuursjaarRight">
                {props.leden.map(lid =>
                    <h1 id="bestuurLid">{lid}</h1>
                )}
                <h1 id="jaarBestuur">{props.jaar}</h1>
            </div>
            <div id="line1" class="line vertical"/>
            <div id="line2" class="line vertical"/>
            <div id="line3" class="line vertical"/>
            <div id="line4" class="line horizontal"/>
            <div id="line5" class="line horizontal"/>
            <div id="line6" class="line horizontal"/>
        </div>
    )
}

export default Bestuursjaar;