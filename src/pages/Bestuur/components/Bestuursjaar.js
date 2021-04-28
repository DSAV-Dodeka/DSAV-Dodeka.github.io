import React from "react";
import Header from "../../../components/Header";

function Bestuursjaar(props) {
    return(
        <div class="relative w-full bg-blauw bg-opacity-90">
            <div class="inline-block w-1/2 align-top mt-12">
                <div class="w-1/2 float-right">
                    <Header text={props.naam}/>
                </div>
                <img class="w-3/4 float-right" src={require(`../../../images/bestuur/${props.foto}`).default} alt=""/>
                
            </div>
            <div class="inline-block w-1/4 mt-8 mb-2">
                {props.leden.map(lid =>
                    <h1 class="lg:text-3xl text-white mx-16 mt-4">{lid}</h1>
                )}
                <h1 class="lg:text-3xl text-white mx-16 mt-16">{props.jaar}</h1>
            </div>
            <div class="absolute bg-white h-full w-1 top-0 left-1/2"/>
            <div class="absolute bg-white h-full w-1 top-0 left-1/2 ml-4"/>
            <div class="absolute bg-white h-full w-1 top-0 left-1/2 ml-8"/>
            <div class="absolute bg-white h-1 w-1/4 top-8 left-1/2"/>
            <div class="absolute bg-white h-1 w-1/4 top-12 left-1/4 ml-8"/>
            <div class="absolute bg-white h-1 w-1/4 top-12 left-1/4"/>
        </div>
    )
}

export default Bestuursjaar;