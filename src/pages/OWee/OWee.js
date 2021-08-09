import React from "react";
import PageTitle from "../../components/PageTitle";
import pcPlanning from "../../images/owee/planningPC.svg";
import mobielPlanning from "../../images/owee/planningMobiel.svg";
import Header from "../../components/Header";
import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function OWee() {
    const { height, width } = useWindowDimensions();

    return(
        <div class="text-center">
            <PageTitle title="OWee"/>
            <div class="w-full bg-blauw bg-opacity-90 py-8 mb-24">
                <h1 class="text-white text-xl font-bold mx-4 lg:mx-16 text-left pb-8">
                    Het startschot van jouw studententijd!
                </h1>
                <p class="text-white text-md mx-4 lg:mx-16 text-left">
                Tijdens de Owee zal D.S.A.V Dodeka aan jullie laten zien dat wij de perfecte combinatie zijn van sporten, gezelligheid en enthousiasme. We zijn daarom tijdens de Owee op veel plekken te vinden. Wij zullen bij de sportmarkt op X zijn, jullie kunnen langskomen op de vereniging tijdens het verenigingsbezoek en we staan op het sportfeest bij Proteus. Daarnaast zullen wij op maandag en woensdag op onze baan trainingen, clinics en borrels organiseren. Dit is het perfecte moment om te kijken hoe onze vereniging dagelijks zal zijn. Kom een keer kijken om mee te maken wat er allemaal te beleven is bij D.S.A.V. Dodeka!
                </p>
                <div class="lg:flex justify-evenly pt-8 px-4">
                    <a target="_blank" rel="noreferrer" href="https://app.owee.nl/knowledge/5efd9cc8bf2d6739e3e4de59"><button class="bg-rood w-full lg:w-64 text-white text-xl font-bold rounded-xl p-4">Onze OWee-pagina</button></a>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/dsavdodeka/?hl=nl"><button class="bg-rood mt-8 lg:mt-0 w-full lg:w-64 text-white text-xl font-bold rounded-xl p-4">Onze Instagram</button></a>
                </div>
            </div>
            <div class="w-full bg-blauw bg-opacity-90 py-8 mb-24">
                <Header text="Programma" position="left"/>
                {width >= 1024 ? <img src={pcPlanning} alt="" class="px-16 pt-8"/> : <img src={mobielPlanning} alt="" class="px-4 lg:px-16 pt-8"/>}
                <div class="lg:flex justify-evenly pt-8 px-4">
                    <a target="_blank" rel="noreferrer" href="https://app.owee.nl/knowledge/5efd9cc8bf2d6739e3e4de59"><button class="bg-rood w-full lg:w-64 text-white text-xl font-bold rounded-xl p-4">Onze OWee-pagina</button></a>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/dsavdodeka/?hl=nl"><button class="bg-rood mt-8 lg:mt-0 w-full lg:w-64 text-white text-xl font-bold rounded-xl p-4">Onze Instagram</button></a>
                </div>
            </div>
            
        </div>
        
    )
}

export default OWee;