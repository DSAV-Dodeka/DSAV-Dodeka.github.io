import React from "react";
import Foto from "./Foto";
import Title from "./Title"
import logo from "../../../images/placeholder.png";

function Nieuwsbericht(props) {
    return(
        <div class="pt-16 relative">
            <Foto image={logo} position={props.position}/>
            <div class="w-full py-8 bg-dsav_blauw bg-opacity-90">
                <Title title="Nieuws pagina eindelijk bijna af" position={props.position}/>
                <p class={"my-4 px-16 text-white" + (props.position === "left" ? " text-left" : " text-right")}>
                    18/02/2021 | Anonieme verslaggever
                </p>
                <p class="my-8 px-16 text-white text-left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam laoreet ipsum at pretium suscipit. Morbi accumsan turpis neque, non tincidunt ipsum tempus et. Pellentesque a mi sit amet lectus ultrices tincidunt et sit amet lorem. Sed varius porttitor rutrum. Nulla sodales arcu orci, laoreet porta augue faucibus imperdiet. Praesent nec massa consectetur, sagittis urna ut, interdum purus. Cras vehicula placerat elementum. Mauris eu dolor leo. Vivamus nisl nunc, interdum eget blandit a, venenatis sit amet metus. Donec vehicula augue eu orci efficitur tristique. Donec luctus consectetur enim eget luctus. Aenean suscipit ornare turpis dignissim consequat. Quisque neque urna, iaculis non tincidunt cursus, rhoncus ac orci. Nulla eleifend mollis porta.
                    Aliquam a quam eget quam sagittis commodo. Fusce feugiat quis dui sagittis tempus. Morbi in dolor in eros pulvinar convallis. Aliquam ac porta enim. Suspendisse eget augue commodo, fermentum urna ultricies, facilisis ipsum. Nulla mollis elit ut augue convallis efficitur. Nunc nec porttitor dolor, non dictum dui. Vestibulum sed metus hendrerit, ornare ex quis, pulvinar metus. Morbi varius, eros quis blandit consectetur, tellus mi feugiat ipsum, vitae porttitor risus nibh in purus. Quisque ut purus convallis, feugiat turpis a, convallis urna.
                </p>    
            </div> 
        </div>   
    )
}

export default Nieuwsbericht;

