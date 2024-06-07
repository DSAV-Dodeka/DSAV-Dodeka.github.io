import React, {useState} from "react";
import "./Eregalerij.scss";
import Erelid from "./components/Erelid";
import PageTitle from "../../../components/PageTitle";
import EregalerijText from "../../../content/Eregalerij.json"

function Eregalerij() {
    const [galerij, setGalerij] = useState("Erelid");

    return(
        <div>
            <PageTitle title="Eregalerij"/>
            <div className="toggle_container">
                <div className="eretoggle">
                    <p className={"toggleLeft" + (galerij === "Erelid" ? " toggleActive": " toggleInactive")} onClick={() => {setGalerij("Erelid")}}>Ereleden</p>
                    <p className={"toggleRight" + (galerij === "Verdienste" ? " toggleActive": " toggleInactive")} onClick={() => {setGalerij("Verdienste")}}>Leden van Verdienste</p>
                </div>
            </div>
            
            <div className="ere_container">
                {
                    (galerij === "Erelid" ? 
                        EregalerijText.Ereleden.map((erelid) => 
                            <Erelid naam={erelid.naam} foto={"vereniging/eregalerij/" + erelid.foto} redenen={erelid.redenen}/>
                        ) :
                        EregalerijText["Leden van verdienste"].map((erelid) => 
                            <Erelid naam={erelid.naam} foto={"vereniging/eregalerij/" + erelid.foto} redenen={erelid.redenen}/>
                        )
                    )

                }
            </div>
        </div>
    )
}

export default Eregalerij;