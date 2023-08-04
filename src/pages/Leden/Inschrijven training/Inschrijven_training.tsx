import PageTitle from "../../../components/PageTitle";
import "./Inschrijven_training.scss";
import AuthContext from "../../Auth/AuthContext";
import { useContext, useState } from "react";
import { queryError } from "../../../functions/queries";
import Training from "./components/Training";

const trainingen = [
    {
        "training_id": "1_training",
        "date_time": "Za 5 aug",
        "events": ["Sprint", "MiLa", "Loopgroep", "Kogel", "Ver"],
        "cancelled": "",
        "signed_up": []
    },
    {
        "training_id": "0_training",
        "date_time": "Ma 7 aug",
        "events": [],
        "cancelled": "vakantie",
        "signed_up": []
    },
    {
        "training_id": "0_training",
        "date_time": "Wo 9 aug",
        "events": ["Sprint", "MiLa", "Loopgroep", "Kogel", "Ver"],
        "cancelled": "",
        "signed_up": []
    },
    {
        "training_id": "0_training",
        "date_time": "Za 12 aug",
        "events": ["Sprint", "MiLa", "Loopgroep", "Hinkstap", "Horde"],
        "cancelled": "",
        "signed_up": []
    },
    {
        "training_id": "0_training",
        "date_time": "Ma 14 aug",
        "events": ["Sprint", "MiLa", "Loopgroep", "Kogel", "Ver"],
        "cancelled": "",
        "signed_up": []
    },
    {
        "training_id": "0_training",
        "date_time": "Wo 16 aug",
        "events": [],
        "cancelled": "NSK Teams",
        "signed_up": []
    }
]
    


function InschrijvenTraining (){

    const {authState, setAuthState} = useContext(AuthContext)
    const [activeTraining, setActiveTraining] = useState("1_training")

    return (
        <div>
            <PageTitle title="Inschrijven trainingen"/>
            <div className="schema_link_container">
                <a className="schema_link" href="https://docs.google.com/spreadsheets/d/1ciyiBdMRWJJDbawQ6BwbT79nse-rXx9-uYF3qLIZTdU/edit#gid=334315521" rel="noreferrer" target="_blank">Bekijk hier de trainingsschema's</a>
            </div>
            <div className="trainingen_container">
                {trainingen.map((item) => <Training id={item.training_id} date_time={item.date_time} cancelled={item.cancelled} events={item.events} signed_up={item.signed_up} active={activeTraining === item.training_id}/>)}
            </div>

        </div>
    );
}

export default InschrijvenTraining;
