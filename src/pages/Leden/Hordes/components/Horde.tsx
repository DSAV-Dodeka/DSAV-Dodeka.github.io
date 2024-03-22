import React, {useContext, useEffect, useState} from "react";
import getUrl from "../../../../functions/links";
import "./Horde.scss";

export interface HordeProps {
    naam: string
    tekst: string
    join: string
    foto: string
}

const Horde = ({naam, tekst, join, foto} : HordeProps) => {

    return (
        <div className="horde_card">
            <img className="horde_img" src={getUrl(`leden/hordes/` + foto)}/>
            <p className="horde_naam">{naam}</p>
            <p className="horde_content">{tekst}</p>
            <a className="horde_join" href={join}>Join deze horde</a>
        </div>
    )
}

export default Horde;
