import Header from "../../../components/Header";
import "./CommissieFlip.css";

function Commissie(props) {
    function slideIn() {
        document.getElementById(props.name).classList.add("out");
        document.getElementById(props.name).classList.remove("in");

        const scrollContainer = document.getElementById(props.name + "scroll");
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
        scrollContainer.scrollTo(1, 0);
        var scroll = window.self.setInterval(() => {
            console.log(scrollContainer.scrollLeft);
            console.log(scrollWidth);
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
        props.position === "right" ? (
        <div id={props.name} class="commissie relative h-128">
            <div class="test relative bg-blauw bg-opacity-90 inline-block h-full mr-16 py-8">
                    <Header text={props.name} position="left" />
                    <p class="text-lg text-white mx-16 mt-8">
                        {props.info}
                    </p>
                    <div class="cursor-pointer bg-rood text-white text-xl font-bold absolute flex space-x-4 right-0 top-8 p-3 h-8" onClick={() => slideIn()}>
                        <p>Bekijk de leden</p>
                        <svg id="" xmlns="http://www.w3.org/2000/svg" class="w-6 h-8 fill-current" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>

                    </div>
                </div>
                <img class={"w-128 h-128 inline-block align-top"} src={require(`../../../images/commissies/${props.fotos}/logo.jpg`).default} alt="" />
                
                <div class="test relative bg-blauw bg-opacity-90 inline-block h-full mr-16 py-8">
                    <Header text={props.name + " leden"} position="left" />
                    <div id={props.name + "scroll"} class="pt-8 pb-4 overflow-auto overflow-x-scroll whitespace-nowrap">
                        {props.leden.map((lid) =>
                            <div class="h-full inline-block h-96">
                                <img class="block h-72 mx-8" src={require(`../../../images/commissies/${props.fotos}/${lid.foto}.jpg`).default} alt="" />
                                <p class="py-2 block text-white font-bold text-xl text-center ">{lid.naam}</p>
                                <p class=" block text-rood font-bold text-md text-center ">{lid.functie}</p>
                            </div>
                        )}
                    </div>
                    <div class="cursor-pointer bg-rood text-white text-xl flex space-x-4 font-bold absolute right-0 top-8 p-3 h-8 rounded-tr" onClick={() => slideOut()}>
                        <svg id="" xmlns="http://www.w3.org/2000/svg" class=" right-4 top-0 bottom-0 my-auto w-6 h-8 fill-current transform rotate-180" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
                        <p>Bekijk de commissie</p>
                    </div>
                </div>
                
                <div class={"align-top inline-block w-128 h-128 bg-blauw content-center"}>
                    <img class="w-128 align-center" src={require(`../../../images/commissies/${props.fotos}/commissie.jpg`).default} alt="" />
                </div>

                
        </div>) :
        (<div id={props.name} class="commissie relative h-128">
        <img class={"w-128 h-128 inline-block align-top"} src={require(`../../../images/commissies/${props.fotos}/logo.jpg`).default} alt="" />
        <div class="test relative bg-blauw bg-opacity-90 inline-block h-full ml-16 py-8">
            <Header text={props.name} position="left" />
            <p class="text-lg text-white mx-16 mt-8">
                {props.info}
            </p>
            <div class="cursor-pointer bg-rood text-white text-xl font-bold absolute flex space-x-4 right-0 top-8 p-3 h-8" onClick={() => slideIn()}>
                <p>Bekijk de leden</p>
                <svg id="" xmlns="http://www.w3.org/2000/svg" class=" right-4 top-0 bottom-0 my-auto w-6 h-8 fill-current" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>

            </div>
        </div>
        
        
        <div class={"align-top inline-block w-128 h-128 bg-blauw content-center"}>
            <img class="w-128 align-center" src={require(`../../../images/commissies/${props.fotos}/commissie.jpg`).default} alt="" />
        </div>

        <div class="test relative bg-blauw bg-opacity-90 inline-block h-full ml-16 py-8">
            <Header text={props.name + " leden"} position="left" />
            <div id={props.name + "scroll"} class="pt-8 pb-4 overflow-auto overflow-x-scroll whitespace-nowrap">
                {props.leden.map((lid) =>
                    <div class="h-full inline-block h-96">
                        <img class="block h-72 mx-8" src={require(`../../../images/commissies/${props.fotos}/${lid.foto}.jpg`).default} alt="" />
                        <p class="py-2 block text-white font-bold text-xl text-center ">{lid.naam}</p>
                        <p class=" block text-rood font-bold text-md text-center ">{lid.functie}</p>
                    </div>
                )}
            </div>
            <div class="cursor-pointer bg-rood text-white text-xl flex space-x-4 font-bold absolute right-0 top-8 p-3 h-8 rounded-tr" onClick={() => slideOut()}>
                <svg id="" xmlns="http://www.w3.org/2000/svg" class=" right-4 top-0 bottom-0 my-auto w-6 h-8 fill-current transform rotate-180" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
                <p>Bekijk de commissie</p>
            </div>
        </div>
</div>)
    
        
    )
}

export default Commissie;