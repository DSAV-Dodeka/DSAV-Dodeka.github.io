import React, { useState } from "react";
import PageTitle from "../../../components/PageTitle";
import Record from "./components/Record";
import RecordText from "../../../content/Records.json";
import "./Records.scss";

function Records() {
    const [locatie, setLocatie] = useState("Outdoor");
    const [geslacht, setGeslacht] = useState("Vrouwen");
    const [activeRecord, setActiveRecord] = useState("none");
    const vrouwenoutdoor = RecordText.vrouw.outdoor;
    const vrouwenindoor = RecordText.vrouw.indoor;
    const mannenoutdoor = RecordText.man.outdoor;
    const mannenindoor = RecordText.man.indoor;

    return(
        <div className="records">
            <PageTitle title="Records" />
            <div className="toggles">
                <div className="toggle">
                    <p className={"toggleLeft" + (geslacht === "Vrouwen" ? " toggleActive": " toggleInactive")} onClick={() => {setGeslacht("Vrouwen"); setActiveRecord("none")}}>Vrouwen</p>
                    <p className={"toggleRight" + (geslacht === "Mannen" ? " toggleActive": " toggleInactive")} onClick={() => {setGeslacht("Mannen"); setActiveRecord("none")}}>Mannen</p>
                </div>
                <div className="toggle">
                    <p className={"toggleLeft" + (locatie === "Outdoor" ? " toggleActive": " toggleInactive")} onClick={() => {setLocatie("Outdoor"); setActiveRecord("none")}}>Outdoor</p>
                    <p className={"toggleRight" + (locatie === "Indoor" ? " toggleActive": " toggleInactive")} onClick={() => {setLocatie("Indoor"); setActiveRecord("none")}}>Indoor</p>
                </div>
            </div>
            {
                (geslacht === "Vrouwen" ?
                    (locatie === "Outdoor" ? 
                        vrouwenoutdoor.map((record) =>
                            <Record key={record.onderdeel} onderdeel={record.onderdeel} prestaties={record.prestaties} active={activeRecord === ("vo" + record.onderdeel)} onClick={() => activeRecord === ("vo" + record.onderdeel) ? setActiveRecord("none") : (record.prestaties.length > 1 ? setActiveRecord("vo" + record.onderdeel) : "")}/>
                        ) :
                        vrouwenindoor.map((record) =>
                            <Record key={record.onderdeel} onderdeel={record.onderdeel} prestaties={record.prestaties} active={activeRecord === ("vi" + record.onderdeel)} onClick={() => activeRecord === ("vi" + record.onderdeel) ? setActiveRecord("none") : (record.prestaties.length > 1 ? setActiveRecord("vi" + record.onderdeel) : "")}/>
                        )
                    )
                    :
                    (locatie === "Outdoor" ? 
                        mannenoutdoor.map((record) =>
                            <Record key={record.onderdeel} onderdeel={record.onderdeel} prestaties={record.prestaties} active={activeRecord === ("mo" + record.onderdeel)} onClick={() => activeRecord === ("mo" + record.onderdeel) ? setActiveRecord("none") : (record.prestaties.length > 1 ? setActiveRecord("mo" + record.onderdeel) : "")}/>
                        ) :
                        mannenindoor.map((record) =>
                            <Record key={record.onderdeel} onderdeel={record.onderdeel} prestaties={record.prestaties} active={activeRecord === ("mi" + record.onderdeel)} onClick={() => activeRecord === ("mi" + record.onderdeel) ? setActiveRecord("none") : (record.prestaties.length > 1 ? setActiveRecord("mi" + record.onderdeel) : "")}/>
                        )
                    )
                )
            }
            {/* <Record active={activeRecord === "test"} onClick={() => activeRecord === "test" ? setActiveRecord("none") : setActiveRecord("test")}/>
            <Record active={false}/>
            <Record active={false}/>
            <Record active={false}/> */}
        </div>
    )
}

export default Records;