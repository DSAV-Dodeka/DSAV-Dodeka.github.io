import React from "react";
import "./Erelid.scss";
import { getDeepImagesUrl } from "../../../../functions/links";

interface ErelidProps {
    naam: string;
    redenen: string[];
    foto: string;
    showdetails: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

function Erelid({ naam, redenen, foto, showdetails, onClick, onMouseEnter, onMouseLeave }: ErelidProps) {
    return (
        <div className={`erelid ${showdetails ? 'showdetails' : ''}`} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <img className="erelid_foto" src={getDeepImagesUrl(foto)} />
            <p className="erelid_naam">{naam}</p>
            <div className="erelid_info">
                {
                    redenen.map((text) =>
                        <li>{text}</li>
                    )
                }
            </div>

        </div>
    )
}

export default Erelid;