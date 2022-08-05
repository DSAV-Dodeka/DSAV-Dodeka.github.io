import React, { useState } from "react";
import PageTitle from "../../components/PageTitle";
import "./Records.scss";

function Records() {
    const [locatie, setLocatie] = useState("Outdoor");
    const [geslacht, setGeslacht] = useState("Vrouwen");

    return(
        <div>
            <PageTitle title="Records" />
            <div className="toggles">
                <div className="toggle">
                    <p className={"toggleLeft" + (geslacht === "Vrouwen" ? " toggleActive": " toggleInactive")} onClick={() => setGeslacht("Vrouwen")}>Vrouwen</p>
                    <p className={"toggleRight" + (geslacht === "Mannen" ? " toggleActive": " toggleInactive")} onClick={() => setGeslacht("Mannen")}>Mannen</p>
                </div>
                <div className="toggle">
                    <p className={"toggleLeft" + (locatie === "Outdoor" ? " toggleActive": " toggleInactive")} onClick={() => setLocatie("Outdoor")}>Outdoor</p>
                    <p className={"toggleRight" + (locatie === "Indoor" ? " toggleActive": " toggleInactive")} onClick={() => setLocatie("Indoor")}>Indoor</p>
                </div>
            </div>
            <p>{locatie + " " + geslacht}</p>
        </div>
    )
}

export default Records;