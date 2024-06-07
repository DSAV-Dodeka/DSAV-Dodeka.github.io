import React from "react";
import "./Erelid.scss";
import getUrl from "../../../../functions/links";

export interface ErelidProps {
    naam: string
    redenen: string[]
    foto: string
}

function Erelid({naam, redenen, foto} : ErelidProps) {
    console.log(redenen.map((text) => text))
    return(
        <div className="erelid">
            <img className="erelid_foto" src={getUrl(foto)}/>
            <p className="erelid_naam">{naam}</p>
            <div className="erelid_info">
                {
                    redenen.map((text) =>
                        <p>- {text}</p>
                    )
                }
            </div>
            
        </div>
    )
}

export default Erelid;