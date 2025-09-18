import React, {useContext} from "react";
import { Link } from "react-router";
import AuthContext from "../Auth/AuthContext";
import PageTitle from "../../components/PageTitle";
import "./Leden.scss";
import {getNestedImagesUrl} from "../../functions/links";

const Leden = () => {
    const {authState: ac, setAuthState} = useContext(AuthContext)

    return (
        <>            
            {!ac.isAuthenticated && (
                <>
                <PageTitle title="Leden"/>
                <p className="leden_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
                </>
            )}
            {ac.isAuthenticated && (
                <>
                <PageTitle title={"Welkom, " + ac.it.given_name} />
                <div className="leden_container">
                <div className="leden_routes">
                    <Link className="leden_link_double" to="" >
                        <h1 className="leden_link_double_header">Inschrijven trainingen</h1>
                        <img src={getNestedImagesUrl("leden/soon.jpg")} className="leden_link_double_image" alt=""/>
                    </Link>
                    <Link className="leden_link" to='klassementen' >
                        <h1 className="leden_link_header">Klassementen</h1>
                        <img src={getNestedImagesUrl("leden/klassementen.png")} className="leden_link_image" alt=""/>
                    </Link>
                    <Link className="leden_link" to='verjaardagen' >
                        <h1 className="leden_link_header">Verjaardagen</h1>
                        <img src={getNestedImagesUrl("leden/verjaardagen.jpg")} className="leden_link_image" alt=""/>
                    </Link>
                </div>
                <div className="leden_routes">
                    <Link className="leden_link" to='' >
                        <h1 className="leden_link_header">Agenda</h1>
                        <img src={getNestedImagesUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                    </Link>
                    <Link className="leden_link" to='' >
                        <h1 className="leden_link_header">Foto's</h1>
                        <img src={getNestedImagesUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                    </Link>
                    <Link className="leden_link" to='' >
                        <h1 className="leden_link_header">Smoelenboek</h1>
                        <img src={getNestedImagesUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                    </Link>
                    <Link className="leden_link" to='' >
                        <h1 className="leden_link_header">Documenten</h1>
                        <img src={getNestedImagesUrl("leden/soon.jpg")} className="leden_link_image" alt=""/>
                    </Link>
                </div>
                </div>
                </>
                
            )}
        </>
    )
}

export default Leden;