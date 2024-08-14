import React, { useState } from "react";
import "./Gezelligheid.scss";
import Image1 from "../../images/gezelligheid/biermijl.jpg";
import Image2 from "../../images/gezelligheid/nsk_teams_algemeen.jpeg";
import Image3 from "../../images/gezelligheid/nskCrossGroep.jpg";
import Image4 from "../../images/gezelligheid/uithof.jpg";
import PageTitle from "../../../components/PageTitle";
import getUrl from "../../../functions/links";

function Gezelligheid(){

    return(
        <div className="algemeen">

            <div className="headeropmaak">
                <PageTitle title="Gezelligheid"/>
            </div>

            <div className="fotobalk">
                <img className="fotos" src={getUrl(`gezelligheid/biermijl.jpg`)} alt="foto1"/>
                <img className="fotos" src={getUrl(`gezelligheid/nsk_teams_algemeen.jpeg`)} alt="foto2"/>
                <img className="fotos" src={getUrl(`gezelligheid/gala1.jpg`)} alt="foto4"/>
                <img className="fotos" src={getUrl(`gezelligheid/uithof.jpg`)} alt="foto3"/>
                {/* <img className="fotos" src={Image4} alt="foto4"/> */}
            </div>

            {/* <div className="textalgemeen"> */}
                <div className="textkolom">
                    <h1 className="textvakheader">Borrels</h1>
                    <p className="text">
                    Een studenten(sport)vereniging is natuurlijk niet compleet zonder borrels! Elke woensdag wordt er een borrel georganiseerd waarbij er ook de mogelijkheid is om mee te eten!
                    </p>
                </div>

                <div className="textkolom">
                    <h1 className="textvakheader">Activiteiten</h1>
                    <p className="text">
                    Naast atletiek doen we bij Dodeka graag allerlei (sportieve) activiteiten zoals boulderen, schaatsen, bubbelvoetbal en feestjes meepakken!
                    </p>
                </div>

                <div className="textkolom">
                    <h1 className="textvakheader">Reizen</h1>
                    <p className="text">
                    Twee keer per jaar wordt er door Dodekaleden een reis georganiseerd. Elk jaar in de TU vakantie organiseren Dodekaleden een wintersport, en in de eerste week van de zomervakantie een zomerreis!
                    </p>
                {/* </div> */}

            </div>
            
        </div>
    )

}

export default Gezelligheid;