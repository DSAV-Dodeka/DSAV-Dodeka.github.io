import React from "react";
import PageTitle from "../../components/PageTitle";
import pcPlanning from "../../images/owee/planning_pc.svg";
import Header from "../../components/Header";
import {
    HashLink as Link
  } from "react-router-hash-link";

function Nieuws() {

    return(
        <div class="text-center">
            <PageTitle title="OWee"/>
            <div class="w-full bg-blauw bg-opacity-90 py-8 mb-24">
                <h1 class="text-white text-3xl font-bold mx-16 text-left pb-8">
                    Het startschot van jouw studententijd!
                </h1>
                <p class="text-white text-lg mx-16 text-left">
                Tijdens de Owee zal D.S.A.V Dodeka aan jullie laten zien dat wij de perfecte combinatie zijn van sporten, gezelligheid en enthousiasme. We zijn daarom tijdens de Owee op veel plekken te vinden. Wij zullen bij de sportmarkt op X zijn, jullie kunnen langskomen op de vereniging tijdens het verenigingsbezoek en we staan op het sportfeest bij Proteus. Daarnaast zullen wij op maandag en woensdag op onze baan trainingen, clinics en borrels organiseren. Dit is het perfecte moment om te kijken hoe onze vereniging dagelijks zal zijn. Kom een keer kijken om mee te maken wat er allemaal te beleven is bij D.S.A.V. Dodeka!
                </p>
                <div class="flex justify-evenly pt-8">
                    <a target="_blank" rel="noreferrer" href="https://app.owee.nl/knowledge/5efd9cc8bf2d6739e3e4de59"><button class="bg-rood w-64 text-white text-xl font-bold rounded-xl p-4">Onze OWee-pagina</button></a>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/dsavdodeka/?hl=nl"><button class="bg-rood w-64 text-white text-xl font-bold rounded-xl p-4">Onze Instagram</button></a>
                </div>
            </div>
            <div class="w-full bg-blauw bg-opacity-90 py-8 mb-24">
                <Header text="Programma" position="left"/>
                <img src={pcPlanning} alt="" class="px-16 pt-8"/>
                <div class="flex justify-evenly pt-8">
                    <a target="_blank" rel="noreferrer" href="https://app.owee.nl/knowledge/5efd9cc8bf2d6739e3e4de59"><button class="bg-rood w-64 text-white text-xl font-bold rounded-xl p-4">Onze OWee-pagina</button></a>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/dsavdodeka/?hl=nl"><button class="bg-rood w-64 text-white text-xl font-bold rounded-xl p-4">Onze Instagram</button></a>
                </div>
            </div>
            
        </div>
        
    )
}

export default Nieuws;