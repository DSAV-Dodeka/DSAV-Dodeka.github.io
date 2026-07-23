// import React, {useContext, useEffect, useState} from "react";
import "./reglementen.scss";
import plaatje from "../../../images/vereniging/reglementen/lijnen3.png"
import PageTitle from "../../../components/PageTitle";


function Reglementen() {
    return (
        <div>
            <PageTitle title="Reglementen" />
            <div className="reglementen-container">
                {/* Achtergrond SVG */}
                <img className="aha" src={plaatje} alt="achtergrond" />

                <div className="reglementen-grid">
                    <div className="leden_link_wrapper">
                        <div className="leden_link_shadow"></div>
                        <div className="leden_link">
                            <a
                                href="/files/DSAV_Dodeka_Statuten.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="leden_link_header"
                            >
                                Statuten
                            </a>
                        </div>
                    </div>

                    <div className="leden_link_wrapper">
                        <div className="leden_link_shadow"></div>
                        <div className="leden_link">
                            <a
                                href="/files/Huishoudelijk_Reglement_Juni_2026.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="leden_link_header"
                            >
                                Huishoudelijk Reglement
                            </a>
                        </div>
                    </div>

                    <div className="leden_link_wrapper">
                        <div className="leden_link_shadow"></div>
                        <div className="leden_link">
                            <a
                                href="/files/Trainers_gedragscode.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="leden_link_header"
                            >
                                Trainers gedragscode
                            </a>
                        </div>
                    </div>

                    <div className="leden_link_wrapper">
                        <div className="leden_link_shadow"></div>
                        <div className="leden_link">
                            <a
                                href="/files/Bestuur_gedragscode.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="leden_link_header"
                            >
                                Bestuur gedragscode
                            </a>
                        </div>
                    </div>

                    <div className="leden_link_wrapper">
                        <div className="leden_link_shadow"></div>
                        <div className="leden_link">
                            <a
                                href="/files/DSAV_Dodeka_Gedragscode.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="leden_link_header"
                            >
                                Leden gedragscode
                            </a>
                        </div>
                    </div>
                    <div className="leden_link_wrapper">
                        <div className="leden_link_shadow"></div>
                        <div className="leden_link">
                            <a
                                href="/files/Privacyverklaring_Dodeka_Juni_2026.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="leden_link_header"
                            >
                                Privacy verklaring
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reglementen;