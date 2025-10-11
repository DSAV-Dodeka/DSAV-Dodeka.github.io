// import React, {useContext, useEffect, useState} from "react";
import "./Reglementen.scss";
import soon from "$images/leden/soon.jpg";


function Reglementen() {
        return(
<<<<<<< HEAD
            <div className="reglementen-container">
                <div className="leden_link">
                        {/* <img src={soon} className="leden_link_image" alt=""/> */}
                        <a href="/files/DSAV_Dodeka_Statuten.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Statuten</a>
                </div>
                <div className="leden_link">
                        {/* <img src={soon} className="leden_link_image" alt=""/> */}
                        <a href="/files/Huishoudelijk_Reglement.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Huishoudelijk Reglement</a>
                </div>
                <div className="leden_link">
                        {/* <img src={soon} className="leden_link_image" alt=""/> */}
                        <a href="/files/Trainers_gedragscode.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Trainers gedragscode</a>
                </div>
                <div className="leden_link">
                        {/* <img src={soon} className="leden_link_image" alt=""/> */}
                        <a href="/files/Bestuur_gedragscode.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Bestuur gedragscode</a>
=======
            <div>
                <PageTitle title="Reglementen" />
                <div className="reglementen-container">
                  <div className="reglementen-grid">
                    <div className="leden_link">
                            <a href="/files/DSAV_Dodeka_Statuten.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Statuten</a>
                    </div>
                    <div className="leden_link">
                            <a href="/files/Huishoudelijk_Reglement.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Huishoudelijk Reglement</a>
                    </div>
                    <div className="leden_link">
                            <a href="/files/Trainers_gedragscode.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Trainers gedragscode</a>
                    </div>
                    <div className="leden_link">
                            <a href="/files/Bestuur_gedragscode.pdf" target="_blank" rel="noreferrer" className="leden_link_header">Bestuur gedragscode</a>
                    </div>
                  </div>
>>>>>>> reglementen_update
                </div>
            </div>
        )
}

export default Reglementen;