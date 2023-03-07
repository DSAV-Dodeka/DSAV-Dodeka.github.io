import React, {useContext, useEffect, useState} from "react";
import PageTitle from "../../../components/PageTitle";
import Wedstrijd from "./components/Wedstrijd";
import "./Hoogtepunten.scss";

const wedstrijden: any[] = [
    {
        "wedstrijd": "NSK Indoor 2023",
        "foto": "test",
        "prijzen": [
            {
                "naam": "Arnold",
                "plaats": 1,
                "afstand": "60m"
            },
            {
                "naam": "Arnold",
                "plaats": 1,
                "afstand": "200m"
            },
            {
                "naam": "Arnold",
                "plaats": 1,
                "afstand": "200m"
            },
            {
                "naam": "Arnold",
                "plaats": 1,
                "afstand": "200m"
            },
            {
                "naam": "Arnold",
                "plaats": 2,
                "afstand": "1500m"
            },
            {
                "naam": "Arnold",
                "plaats": 3,
                "afstand": "1500m"
            },
        ],
        "prestaties": []
    }
]



const Hoogtepunten = () => {
    console.log(wedstrijden[0]);
    return (
        <>
            <PageTitle title="Hoogtepunten"/>
            {wedstrijden.map((item: any, index: any) => {
                return <Wedstrijd naam={item.wedstrijd} foto={item.foto} prijzen={item.prijzen} prestaties={item.prestaties}/>
            })}
        </>
    )
}

export default Hoogtepunten;
