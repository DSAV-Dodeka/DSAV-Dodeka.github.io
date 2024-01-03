import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Auth/AuthContext";
import PageTitle from "../../components/PageTitle";
import "./Leden.scss";
import getUrl from "../../functions/links";
import PR from "./PR/PR";

const Leden = () => {
    const {authState: ac, setAuthState} = useContext(AuthContext);
    const [newPr, setNewPr] = useState(false);

    const closePR = async () => {
        setNewPr(false)
        // // Refetch so updated values are visible
        // await q.refetch()
    }

    return (
        <>            
            {ac.isAuthenticated && (
                <>
                <PageTitle title="Leden"/>
                <p className="leden_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
                </>
            )}
            {!ac.isAuthenticated && (
                <>
                    <PageTitle title={"Welkom, " + ac.it.given_name} />
                    <div className="leden_container">
                        <div className="leden_routes">
                            <Link className="leden_link_double" to="" >
                                <h1 className="leden_link_double_header">Inschrijven trainingen</h1>
                                <img src={getUrl("leden/soon.jpg")} className="leden_link_double_image" alt=""/>
                            </Link>
                            <Link className="leden_link" to='klassementen' >
                                <h1 className="leden_link_header">Klassementen</h1>
                                <img src={getUrl("leden/klassementen.png")} className="leden_link_image" alt=""/>
                            </Link>
                            <Link className="leden_link" to='verjaardagen' >
                                <h1 className="leden_link_header">Verjaardagen</h1>
                                <img src={getUrl("leden/verjaardagen.jpg")} className="leden_link_image" alt=""/>
                            </Link>
                        </div>
                        <div className="leden_routes">
                            <div className="leden_link" onClick={() => setNewPr(true)} >
                                <h1 className="leden_link_header">PRs indienen</h1>
                                <img src={getUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                            </div>
                            <Link className="leden_link" to='' >
                                <h1 className="leden_link_header">Agenda</h1>
                                <img src={getUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                            </Link>
                            <Link className="leden_link" to='' >
                                <h1 className="leden_link_header">Foto's</h1>
                                <img src={getUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                            </Link>
                            <Link className="leden_link" to='' >
                                <h1 className="leden_link_header">Smoelenboek</h1>
                                <img src={getUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                            </Link>
                        </div>
                    </div>
                    {newPr &&
                        <PR closePR={closePR} />
                    }
                </>
                
            )}
        </>
    )
}

export default Leden;