import PageTitle from "../../../components/PageTitle";
import "./Klassementen.scss";
import {Klassement} from "../../../functions/api/klassementen";
import AuthContext from "../../Auth/AuthContext";
import { useContext, useState } from "react";
import {
    queryError, useKlassementQuery,
} from "../../../functions/queries";

const defaultTraining: Klassement = [
    {
        "firstname": "",
        "user_id": "0",
        "lastname": "",
        "points": 0
    },
    {
        "firstname": "",
        "user_id": "0",
        "lastname": "",
        "points": 0
    },
    {
        "firstname": "",
        "user_id": "0",
        "lastname": "",
        "points": 0
    },
]

const defaultPunten: Klassement = [
    {
        "firstname": "",
        "user_id": "0",
        "lastname": "",
        "points": 0
    },
    {
        "firstname": "",
        "user_id": "0",
        "lastname": "",
        "points": 0
    },
    {
        "firstname": "",
        "user_id": "0",
        "lastname": "",
        "points": 0
    },
]

function capitalize(string: string) {
    if (string.includes(" ")) {
        return string.charAt(0).toUpperCase() + string.slice(1).split(" ")[0] + " " + string.slice(1).split(" ")[1].toUpperCase();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


function Klassementen (){

    const {authState, setAuthState} = useContext(AuthContext)

    const [mobileVisible, setMobileVisible] = useState(false);

    const q = useKlassementQuery({ authState, setAuthState }, 'training')
    const training = queryError(q, defaultTraining, "Class Training Query Error")

    const qP = useKlassementQuery({ authState, setAuthState }, 'punten')
    const punten = queryError(qP, defaultPunten, "Class Points Query Error")

    return (
    <div className="algemeen">

        <div>
            <PageTitle title="Klassementen"/>
        </div>

        <div className="kolom">
        <div className="SoortKlassement">
            <p>Trainingsklassement</p>
        </div>
            <div className="EerstePersoonLinks">
                <p>1. {capitalize(training[0].firstname)} {capitalize(training[0].lastname)} - {training[0].points}</p>
            </div>
            <div className="TweedePersoonLinks">
                <p>2. {capitalize(training[1].firstname)} {capitalize(training[1].lastname)} - {training[1].points}</p>
            </div>
            <div className="DerdePersoonLinks">
                <p>3. {capitalize(training[2].firstname)} {capitalize(training[2].lastname)} - {training[2].points}</p>
            </div>
        
        <div className={ "VierEnLagerLinks" + (mobileVisible ? "" : " klassementHidden")}>
            { training.slice(3).map((value, index) => 
                <p key={"training" + index} className="persoonMargin">{index + 4}. {capitalize(value.firstname)} {capitalize(value.lastname)} - {value.points}</p>
            )
            }
        </div>
        <button onClick={() => setMobileVisible(!mobileVisible)} className="klassementLaad">{(mobileVisible ? "Laat minder zien" : "Laat alles zien")}</button>
        </div>
        
        <div className="kolom">
        <div className="SoortKlassement">
            <p>Puntenklassement</p>
        </div>
        <div className="EerstePersoonRechts">
            <p>1. {capitalize(punten[0].firstname)} {capitalize(punten[0].lastname)} - {punten[0].points}</p>
        </div>
        <div className="TweedePersoonRechts">
            <p>2. {capitalize(punten[1].firstname)} {capitalize(punten[1].lastname)} - {punten[1].points}</p>
        </div>
        <div className="DerdePersoonRechts">
            <p>3. {capitalize(punten[2].firstname)} {capitalize(punten[2].lastname)} - {punten[2].points}</p>
        </div>
        <div className={ "VierEnLagerRechts" + (mobileVisible ? "" : " klassementHidden")}>
        { punten.slice(3).map((value, index) => 
                <p key={"punten" + index} className="persoonMargin">{index + 4}. {capitalize(value.firstname)} {capitalize(value.lastname)} - {value.points}</p>
            )
            }
        </div>
        <button onClick={() => setMobileVisible(!mobileVisible)} className="klassementLaad">{(mobileVisible ? "Laat minder zien" : "Laat alles zien")}</button>
        </div>
    </div>
    
    
    );
}

export default Klassementen;
