import React from "react";
import Foto from "./Foto";
import Title from "./Title"
import logo from "../../../images/nieuwsPagina.png";

function Nieuwsbericht(props) {
    return(
        <div class="pt-8 mb-24 relative">
            <Foto image={logo} position={props.position}/>
            <div class="w-full py-8 bg-blauw bg-opacity-90">
                <Title title="NIEUWE WEBSITE .COMT ERAAN!" position={props.position}/>
                <p class={"my-4 px-16 text-white" + (props.position === "left" ? " text-left" : " text-right")}>
                    28/02/2021 | .ComCommentator
                </p>
                <p class="my-8 px-16 text-white text-left">
                    De afgelopen weken heeft de .ComCom de eerste stappen gezet voor onze eigen website.
                    Gisteren bij de ASV is het design van de homepage laten zien, maar er is inmiddels ook al wat geprogrammeerd. 
                    Dankzij de creatieve inbreng van onze design en UI/UX experts en onze QQ'er, kan zelfs ons minst creatieve lid aan de lopende band mooie pagina's creëren, zoals jullie kunnen zien in dit artikel of in de foto (of in de foto in het artikel in de foto, of ...). <br/>
                    Ons doel is om voor de zomer de website online te hebben, maar als we ons door corona vervelen kunnen we jullie eerder al de website (dus niet op corona) laten testen.
                    In die 1.0 versie zullen alle pagina's die nu op de huidige website staan te zien zijn.
                    Dit zal later uitgebreid worden met een aanmeldsysteem en functionaliteiten voor het bestuur en de .commissies.<br/><br/>
                    We zijn heel benieuwd wat jullie van de eerste beelden van de nieuwe website vinden. Dus als je vragen, opmerkingen of tips hebt, laat het ons weten bij Matthijs!
                </p>    
            </div> 
        </div>   
    )
}

export default Nieuwsbericht;

