import React, { useState } from "react";
import "./Eregalerij.scss";
import Erelid from "./components/Erelid";
import PageTitle from "../../../components/PageTitle";
import EregalerijText from "../../../content/Eregalerij.json"

function Eregalerij() {
    const [galerij, setGalerij] = useState("Erelid");

    // Keep track of which item to show the details of
    const [itemToShow, setItemToShow] = useState<string | null>(null);
    let lastClickedItem: string | null = null;

    const handleItemClick = (itemName : string) => {
        // If the last clicked item is clicked again, close it
        if (lastClickedItem === itemName) {
            setItemToShow(null);
            lastClickedItem = null;
        } else {
            setItemToShow(itemName);
            lastClickedItem = itemName;
        }
    };

    return (
        <div>
            <PageTitle title="Eregalerij" />
            <div className="toggle_container">
                <div className="eretoggle">
                    <p className={"toggleLeft" + (galerij === "Erelid" ? " toggleActive" : " toggleInactive")} onClick={() => { setGalerij("Erelid") }}>Ereleden</p>
                    <p className={"toggleRight" + (galerij === "Verdienste" ? " toggleActive" : " toggleInactive")} onClick={() => { setGalerij("Verdienste") }}>Leden van Verdienste</p>
                </div>
            </div>

            <div className="ere_container">
                {
                    (galerij === "Erelid" ?
                        EregalerijText.Ereleden.map((erelid) =>
                            <Erelid
                                key={erelid.naam}
                                naam={erelid.naam}
                                foto={"vereniging/eregalerij/" + erelid.foto}
                                redenen={erelid.redenen}
                                showdetails={itemToShow === erelid.naam}
                                onClick={() => handleItemClick(erelid.naam)}
                                onMouseEnter={() => setItemToShow(erelid.naam)}
                                onMouseLeave={() => setItemToShow(null)}
                            />
                        ) :
                        EregalerijText["Leden van verdienste"].map((erelid) =>
                            <Erelid
                                key={erelid.naam}
                                naam={erelid.naam}
                                foto={"vereniging/eregalerij/" + erelid.foto}
                                redenen={erelid.redenen}
                                showdetails={itemToShow === erelid.naam}
                                onClick={() => handleItemClick(erelid.naam)}
                                onMouseEnter={() => setItemToShow(erelid.naam)}
                                onMouseLeave={() => setItemToShow(null)}
                            />
                        )
                    )

                }
            </div>
        </div>
    )
}

export default Eregalerij;