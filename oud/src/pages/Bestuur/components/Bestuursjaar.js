import React from "react";
import Header from "../../../components/Header";

function Bestuursjaar(props) {
    return(
        <div class="relative w-full bg-blauw bg-opacity-90 overflow-x-hidden">
            <div class="inline-block w-full pl-12 lg:pl-0 lg:w-1/2 align-top mt-6 lg:mt-12">
                <div class="w-full float-right">
                    <Header text={props.naam} position="right"/>
                </div>
                <img class="w-full lg:w-3/4 float-right" src={require(`../../../images/bestuur/${props.foto}`).default} alt=""/>
                
            </div>
            <div class="inline-block w-full lg:w-1/4 mt-2 lg:mt-8 mb-4">
                {props.leden.map(lid =>
                    <h1 class="lg:text-xl text-white mx-16 mt-4">{lid}</h1>
                )}
                <h1 class="lg:text-xl text-white mx-16 mt-4 lg:mt-16">{props.jaar}</h1>
            </div>
            <div class="absolute bg-white h-full w-1 top-0 left-4 lg:left-1/2"/>
            <div class="absolute bg-white h-full w-1 top-0 left-4 lg:left-1/2 ml-4"/>
            <div class="absolute bg-white h-full w-1 top-0 left-4 lg:left-1/2 ml-8"/>
            <div class="absolute bg-white h-1 w-full lg:w-1/4 top-5 lg:top-8 left-4 lg:left-1/2"/>
            <div class="absolute bg-white h-1 w-0 lg:w-1/2 top-12 left-0 "/>
            <div class="absolute bg-white h-1 w-0 lg:w-1/2 top-12 left-0 ml-8"/>
            <div class="absolute bg-white h-1 w-0 lg:w-1/4 top-12 left-1/4"/>
        </div>
    )
}

export default Bestuursjaar;