import Header from "../../../components/Header";
import "./Commissie.scss";

function Commissie(props) {
    function slideIn() {
        document.getElementById(props.name).classList.add("out");
        document.getElementById(props.name).classList.remove("in");

        const scrollContainer = document.getElementById(props.name + "scroll");
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
        scrollContainer.scrollTo(1, 0);
        var scroll = window.self.setInterval(() => {
            if (scrollContainer.scrollLeft !== scrollWidth && scrollContainer.scrollLeft !== 0) {
                scrollContainer.scrollTo(scrollContainer.scrollLeft + 1, 0);
            }
            else {
                window.self.clearInterval(scroll);
            }
        }, 15);


    }

    function slideOut() {
        document.getElementById(props.name).classList.remove("out");
        document.getElementById(props.name).classList.add("in");


    }

    return (
        props.position === "left" || window.innerWidth <= 1023 ? (<div id={props.name} class="commissieContainer">
        <img class="commissieLogo roundedRight" src={require(`../../../images/commissies/${props.fotos}/logo.jpg`).default} alt="" />
        <div class="commissieInfo roundedLeft">
        {props.name === ".ComCom" ? <a target="_blank" rel="noreferrer" class="commissieEasteregg" href="https://nl.wikipedia.org/wiki/Komkommer"><Header text={props.name} position="left" /></a> : <Header text={props.name} position="left" />}
            <p class="commissieStukje">
                {props.info}
            </p>
            <div class="commissieSlider" onClick={() => slideIn()}>
                <p class="commissieSliderMargin">Bekijk de leden</p>
                <svg id="" xmlns="http://www.w3.org/2000/svg" class="commissieArrow" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>

            </div>
        </div>


        <div class="commissieLogo roundedRight">
            <img class="commissieFoto roundedRight" src={require(`../../../images/commissies/${props.fotos}/commissie.jpg`).default} alt="" />
        </div>

        <div class="commissieInfo roundedLeft">
            <Header text={props.name + " leden"} position="left" />
            <div id={props.name + "scroll"} class="commissieLeden">
                {props.leden.map((lid) =>
                    <div class="commissieLid">
                        <img class="commissieLidFoto" src={require(`../../../images/commissies/${props.fotos}/${lid.foto}.jpg`).default} alt="" />
                        <p class="commissieLidNaam">{lid.naam}</p>
                        <p class="commissieLidFunctie">{lid.functie}</p>
                    </div>
                )}
            </div>
            <div class="commissieSlider" onClick={() => slideOut()}>
                <svg id="" xmlns="http://www.w3.org/2000/svg" class="commissieArrow reverseArrow commissieSliderMargin" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
                <p>Bekijk de commissie</p>
            </div>
        </div>
    </div>):
    (
            <div id={props.name} class="commissieContainer">
                <div class="commissieInfo roundedRight inverseMargin">
                    {props.name === ".ComCom" ? <a target="_blank" rel="noreferrer" class="cursor-default" href="https://nl.wikipedia.org/wiki/Komkommer"><Header text={props.name} position="left" /></a> : <Header text={props.name} position="left" />}
                    <p class="commissieStukje">
                        {props.info}
                    </p>
                    <div class="commissieSlider" onClick={() => slideIn()}>
                        <p class="commissieSliderMargin">Bekijk de leden</p>
                        <svg id="" xmlns="http://www.w3.org/2000/svg" class="commissieArrow" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>

                    </div>
                </div>
                <img class={"commissieLogo roundedLeft"} src={require(`../../../images/commissies/${props.fotos}/logo.jpg`).default} alt="" />

                <div class="commissieInfo roundedRight inverseMargin">
                    <Header text={props.name + " leden"} position="left" />
                    <div id={props.name + "scroll"} class="commissieLeden">
                        {props.leden.map((lid) =>
                            <div class="commissieLid">
                                <img class="commissieLidFoto" src={require(`../../../images/commissies/${props.fotos}/${lid.foto}.jpg`).default} alt="" />
                                <p class="commissieLidNaam">{lid.naam}</p>
                                <p class="commissieLidFunctie">{lid.functie}</p>
                            </div>
                        )}
                    </div>
                    <div class="commissieSlider" onClick={() => slideOut()}>
                        <svg id="" xmlns="http://www.w3.org/2000/svg" class="commissieArrow reverseArrow commissieSliderMargin" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
                        <p>Bekijk de commissie</p>
                    </div>
                </div>

                <div class="commissieLogo roundedLeft">
                    <img class="commissieFoto roundedLeft" src={require(`../../../images/commissies/${props.fotos}/commissie.jpg`).default} alt="" />
                </div>


            </div>)
            


    )
}

export default Commissie;