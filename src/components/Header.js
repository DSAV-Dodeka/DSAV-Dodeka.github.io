import React from "react";

function Header(props) {
    return(
        <div class="w-full py-2 bg-rood">
            <h1 class={"mx-4 lg:mx-16 text-xl lg:text-3xl text-white font-bold text-" + props.position}>
                {props.text.toUpperCase()}
            </h1>
        </div>
    )
}
export default Header;