import PageTitle from "../../../components/PageTitle";
import "./Klassementen.scss";
import { PuntenKlassement, TrainingsKlassement } from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import { useContext, useState } from "react";
import { queryError, useBirthdayDataQuery, usePuntenKlassementQuery, useTrainingsKlassementQuery } from "../../../functions/queries";

const defaultTraining: TrainingsKlassement = {
    "points": [
]}

const defaultPunten: PuntenKlassement = {
    "points": [
]}

function capitalize(string: string) {
    if (string.includes(" ")) {
        return string.charAt(0).toUpperCase() + string.slice(1).split(" ")[0] + " " + string.slice(1).split(" ")[1].toUpperCase();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


function Klassementen (){

    const {authState, setAuthState} = useContext(AuthContext)

    const [mobileVisible, setMobileVisible] = useState(false);

    const q = useTrainingsKlassementQuery({ authState, setAuthState })
    const training = queryError(q, defaultTraining, "User Info Query Error").points

    const qP = usePuntenKlassementQuery({ authState, setAuthState })
    const punten = queryError(qP, defaultPunten, "User Info Query Error").points

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
            <p>1. {capitalize(training[0].Naam)} - {training[0].Punten}</p>
        </div>
        <div className="TweedePersoonLinks">
            <p>2. {capitalize(training[1].Naam)} - {training[1].Punten}</p>
        </div>
        <div className="DerdePersoonLinks">
            <p>3. {capitalize(training[2].Naam)} - {training[2].Punten}</p>
        </div>
        
        <div className={ "VierEnLagerLinks" + (mobileVisible ? "" : " klassementHidden")}>
            { training.slice(3).map((value, index) => 
                <p key={"training" + index} className="persoonMargin">{index + 4}. {capitalize(value.Naam)} - {value.Punten}</p>
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
            <p>1. {capitalize(punten[0].Naam)} - {punten[0].Punten}</p>
        </div>
        <div className="TweedePersoonRechts">
            <p>2. {capitalize(punten[1].Naam)} - {punten[1].Punten}</p>
        </div>
        <div className="DerdePersoonRechts">
            <p>3. {capitalize(punten[2].Naam)} - {punten[2].Punten}</p>
        </div>
        <div className={ "VierEnLagerRechts" + (mobileVisible ? "" : " klassementHidden")}>
        { punten.slice(3).map((value, index) => 
                <p key={"punten" + index} className="persoonMargin">{index + 4}. {capitalize(value.Naam)} - {value.Punten}</p>
            )
            }
        </div>
        <button onClick={() => setMobileVisible(!mobileVisible)} className="klassementLaad">{(mobileVisible ? "Laat minder zien" : "Laat alles zien")}</button>
        </div>
    </div>
    
    
    );
}

export default Klassementen;
