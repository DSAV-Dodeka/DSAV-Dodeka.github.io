import React from "react";
import "./Eregalerij.scss";
import Erelid from "./components/Erelid";
import PageTitle from "../../../components/PageTitle";

function Eregalerij() {
    return(
        <div>
            <PageTitle title="Eregalerij"/>
            {/* <div className="toggle"></div> */}
            <div className="ere_container">
                <Erelid />
            </div>
        </div>
    )
}

export default Eregalerij;