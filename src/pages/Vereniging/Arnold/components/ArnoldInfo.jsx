import React from "react";
import arnoldFoto from "../../../../images/arnold/arnoldfoto.jpg";
import "./ArnoldInfo.scss";

function ArnoldInfo() {
    return(
        <div className="arnoldInfo">
            <div className="arnoldText">
                <p>Hoi allemaal! Mijn naam is Arnold het Aardvarken en ik heb de eer gekregen om mascotte te zijn van de leukste studentenatletiekvereniging van Nederland! Ik ben er altijd bij om de Aardvarkentjes van Dodeka te supporten op wedstrijden zoals de zoals de NSK's en de Dodekathlon. Daarnaast mag ik ook mee op alle gezellige reisjes die Dodekaleden organiseren, zoals de Wispo en de Zomerreis en het trainingsweekend. Ben je benieuwd naar mijn avonturen met de Dodekaëders? Neem dan een kijkje op mijn Instagram.</p>
                <a target="_blank" rel="noreferrer" href={"https://www.instagram.com/arnold_dodeka/?hl=nl"} className="arnoldInsta">
                    <svg id="dm_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    <p>Bekijk hier Arnolds Instagram account</p>
                    <svg id="dm_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
                </a>
            </div>
            <img className="arnoldFoto" src={arnoldFoto} alt="" />
        </div>
    )
}

export default ArnoldInfo;