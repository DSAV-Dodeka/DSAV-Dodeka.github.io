import React from "react";
import "./Erelid.scss";
import getUrl from "../../../../functions/links";

function Erelid() {
    return(
        <div className="erelid">
            <img className="erelid_foto" src={getUrl("vereniging/abel.jpg")}/>
            <p className="erelid_naam">Abel Kappenburg</p>
            <p className="erelid_info">Oprichter als commissaris A, Gezorgd voor sterke promotie van DSAV40, Kennis van commissies overgedragen vanuit andere studentenverenigingen.</p>
        </div>
    )
}

export default Erelid;