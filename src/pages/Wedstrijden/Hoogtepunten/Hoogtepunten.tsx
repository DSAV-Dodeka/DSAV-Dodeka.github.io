import React, {useContext, useEffect, useState} from "react";
import PageTitle from "../../../components/PageTitle";
import Wedstrijd from "./components/Wedstrijd";
import "./Hoogtepunten.scss";
import Wedstrijden from "../../../content/Hoogtepunten.json";


const Hoogtepunten = () => {
    return (
        <>
            <PageTitle title="Hoogtepunten"/>
            {Wedstrijden.wedstrijden.map((item: any) => {
                return <Wedstrijd naam={item.wedstrijd} foto={item.foto} prijzen={item.prijzen} prestaties={item.prestaties}/>
            })}
        </>
    )
}

export default Hoogtepunten;
