import PageTitle from "../../../components/PageTitle";
import "./Klassementen.scss";
import AuthContext from "../../Auth/AuthContext";
import { useContext, useState } from "react";
import {
    queryError, useKlassementQuery,
} from "../../../functions/queries";
import {KlassementList} from "../../../functions/api/klassementen";
import EventCategories from "../../../content/EventTypes.json";

const defaultKlassement: KlassementList = [
    {
        "firstname": "Arnold",
        "user_id": "0_arnold",
        "lastname": "het Aardvarken",
        "points": 12
    },
    {
        "firstname": "Arnold",
        "user_id": "1_arnold",
        "lastname": "het Aardvarken 2",
        "points": 12
    },
    {
        "firstname": "Arnold",
        "user_id": "2_arnold",
        "lastname": "het Aardvarken 3",
        "points": 12
    },
]

function capitalize(string: string, firstname: boolean = true) {
    string = string.toLowerCase()
    if (firstname) {
        return string.charAt(0).toUpperCase() + string.slice(1).split(" ")[0]
    } else if (string.split(" ").length == 1) {
        return string.charAt(0).toUpperCase() + string.slice(1).split(" ")[0]
    } else {
        let names = string.split(" ")
        names[names.length -1] = names[names.length -1].charAt(0).toUpperCase() + names[names.length - 1].slice(1)
        return names.join(" ")
    }
  }


function Klassementen (){

    const {authState, setAuthState} = useContext(AuthContext)

    const [mobileVisible, setMobileVisible] = useState(false);
    const [showPointsInfo, setShowPointsInfo] = useState(false);

    const q = useKlassementQuery({ authState, setAuthState }, 'training')
    const training = queryError(q, defaultKlassement, "Class Training Query Error")

    const qP = useKlassementQuery({ authState, setAuthState }, 'points')
    const punten = queryError(qP, defaultKlassement, "Class Points Query Error")

    return (
    <div className="algemeen">

        <div>
            <PageTitle title="Klassementen"/>
        </div>
        {authState.isAuthenticated && (
            <p className="klassementen_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
        )}
        {!authState.isAuthenticated && (
            <>
                <div className="kolom">
                <div className="SoortKlassement">
                    <p>Trainingsklassement</p>
                </div>
                    <div className="EerstePersoonLinks">
                        <p>1. {capitalize(training[0].firstname)} {capitalize(training[0].lastname, false)} - {training[0].points}</p>
                    </div>
                    <div className="TweedePersoonLinks">
                        <p>2. {capitalize(training[1].firstname)} {capitalize(training[1].lastname, false)} - {training[1].points}</p>
                    </div>
                    <div className="DerdePersoonLinks">
                        <p>3. {capitalize(training[2].firstname)} {capitalize(training[2].lastname, false)} - {training[2].points}</p>
                    </div>
                
                <div className={ "VierEnLagerLinks" + (mobileVisible ? "" : " klassementHidden")}>
                    { training.slice(3).map((value, index) => 
                        <p key={"training" + index} className="persoonMargin">{index + 4}. {capitalize(value.firstname)} {capitalize(value.lastname, false)} - {value.points}</p>
                    )
                    }
                </div>
                <button onClick={() => setMobileVisible(!mobileVisible)} className="klassementLaad">{(mobileVisible ? "Laat minder zien" : "Laat alles zien")}</button>
                </div>
                
                <a className="show_info_link" onClick={() => setShowPointsInfo(true)}>Waar krijg je punten voor?</a>
                
                <div className="kolom">
                <div className="SoortKlassement">
                    <p>Puntenklassement</p>
                </div>
                <div className="EerstePersoonRechts">
                    <p>1. {capitalize(punten[0].firstname)} {capitalize(punten[0].lastname, false)} - {punten[0].points}</p>
                </div>
                <div className="TweedePersoonRechts">
                    <p>2. {capitalize(punten[1].firstname)} {capitalize(punten[1].lastname, false)} - {punten[1].points}</p>
                </div>
                <div className="DerdePersoonRechts">
                    <p>3. {capitalize(punten[2].firstname)} {capitalize(punten[2].lastname, false)} - {punten[2].points}</p>
                </div>
                <div className={ "VierEnLagerRechts" + (mobileVisible ? "" : " klassementHidden")}>
                { punten.slice(3).map((value, index) => 
                        <p key={"punten" + index} className="persoonMargin">{index + 4}. {capitalize(value.firstname)} {capitalize(value.lastname, false)} - {value.points}</p>
                    )
                    }
                </div>
                <button onClick={() => setMobileVisible(!mobileVisible)} className="klassementLaad">{(mobileVisible ? "Laat minder zien" : "Laat alles zien")}</button>
                
                </div>

                {showPointsInfo && 
                    <div>
                        <div className="points_info_container" />
                        <div className="points_info_pop_up">
                            <p className="points_info_title">Waar krijg je punten voor?</p>
                            <div className="points_info">
                                <svg xmlns="http://www.w3.org/2000/svg" className="points_info_cross" onClick={() => setShowPointsInfo(false)} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                                <div className="points_info_column">
                                    <h1>Trainingsklassement</h1>
                                    <div className="points_info_row">
                                        <p className="points_info_category">Aanwezig op training</p>
                                        <p className="points_info_points">1 punt</p>
                                    </div>
                                </div>
                                <div className="points_info_column">
                                    <h1>Puntenklassement</h1>
                                    {EventCategories.event_types.map((item) => 
                                        <div className="points_info_row">
                                            <p className="points_info_category">{item.omschrijving}</p>
                                            <p className="points_info_points">{item.default_points + (item.default_points == 1 ? " punt" : " punten")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        )}
    </div>
    
    
    );
}

export default Klassementen;
