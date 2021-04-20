import Header from "../../../components/Header";
import Com from "../../../images/.ComCom.jpg";
import comcom from "../../../images/.ComCom foto.jpeg";
import Matthijs from "../../../images/Matthijs.jpeg";
import Jefry from "../../../images/Jefry.jpeg";
import Nathan from "../../../images/Nathan.jpeg";
import Donne from "../../../images/Donne.jpeg";
import "./CommissieFlip.css";

function Commissie(props) {
    function slideIn() {
        document.getElementById(props.name + 'second').classList.add("in");
        document.getElementById(props.name + 'first').classList.add("out");
        document.getElementById(props.name + 'second').classList.remove("out-back");
        document.getElementById(props.name + 'first').classList.remove("in-back");
    }

    function slideOut() {
        document.getElementById(props.name + 'second').classList.remove("in");
        document.getElementById(props.name + 'first').classList.remove("out");
        document.getElementById(props.name + 'second').classList.add("out-back");
        document.getElementById(props.name + 'first').classList.add("in-back");
    }

    return (
        <div class="w-full overflow-hidden commissie relative h-128">
            <div id={props.name + 'first'} class={"w-full absolute top-0 left-0 flex space-x-16" + (props.position === "right" ? " space-x-reverse" : "")}>
                <img class={"w-128 h-128" + (props.position === "right" ? " order-last" : "")} src={Com} alt="" />
                <div class="flex-grow relative bg-blauw bg-opacity-90 py-8">
                    <Header text={props.name} position="left" />
                    <p class="text-lg text-white mx-16 mt-8">
                        Met het groter worden van de vereniging, is er dit studiejaar ook de .ComCom opgericht. Wij, als .ComCom gaan over de inhoud van de website en het ontwerp ervan. Maar het belangrijkste is dat we werken naar het bouwen van onze eigen DSAV `40 website. Mocht je iets missen op de website qua functionaliteiten, aarzel dan niet om ons dit te laten weten bij Matthijs!
                </p>
                <div class="cursor-pointer bg-rood text-white text-xl font-bold absolute flex space-x-4 right-0 top-8 p-3 h-8" onClick={() => slideIn()}>
                    <p>Bekijk de leden</p>
                    <svg id="" xmlns="http://www.w3.org/2000/svg" class=" right-4 top-0 bottom-0 my-auto w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
            
                </div>
                </div>
            </div>
            <div id={props.name + "second"} class={"h-128 top-0 left-0 w-full flex space-x-16 transform translate-x-full" + (props.position === "right" ? " space-x-reverse" : "")}>
                <div class="flex-none w-128 bg-blauw content-center">
                    <img class={"w-128 py-12" + (props.position === "right" ? " order-last" : "")} src={comcom} alt="" />
                </div>
                    
                    
                    
                
                <div class="h-128 flex-grow relative bg-blauw bg-opacity-90 pt-8 pb-auto">
                    <Header text=".ComCom leden" position="left" />
                    <div class="flex mt-8 mx-8 space-x-8">
                        <div class="inline">
                            <img class="" src={Matthijs} alt=""/>
                            <p class="text-white font-bold text-xl text-center">Matthijs<br/>CTO</p>
                        </div>
                        <div class="inline">
                            <img class="" src={Jefry} alt=""/>
                            <p class="text-white font-bold text-xl text-center">Jefry<br/>Junior UI/UX en chat manager</p>
                        </div>
                        <div class="inline">
                            <img class="" src={Nathan} alt=""/>
                            <p class="text-white font-bold text-xl text-center">Nathan<br/>Senior design critic expert</p>
                        </div>
                        <div class="inline">
                            <img class="" src={Donne} alt=""/>
                            <p class="text-white font-bold text-xl text-center">Donne<br/> QQ'er</p>
                        </div>
                    </div>
                    <div class="cursor-pointer bg-rood text-white text-xl flex space-x-4 font-bold absolute right-0 top-8 p-3 h-8 rounded-tr" onClick={() => slideOut()}>
                    <svg id="" xmlns="http://www.w3.org/2000/svg" class=" right-4 top-0 bottom-0 my-auto w-6 h-6 fill-current transform rotate-180" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
                    <p>Bekijk de commissie</p>
                </div>

                </div>
                
            </div>
        </div>
    )
}

export default Commissie;