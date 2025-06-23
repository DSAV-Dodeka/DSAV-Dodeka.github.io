import React from "react";
import PageTitle from "../../../components/PageTitle";
import Trainer from "./components/Trainer";
import TrainersText from "../../../content/Trainers.json";
import "./Trainers.scss";

function Trainers() {
    return(
        <div>
            <PageTitle title="Trainers" />
            <div id="trainerContainer" className="relative space-y-16 lg:space-y-24 pb-16 lg:pb-24">
                {TrainersText.Trainers.map(trainer => 
                        <Trainer key={trainer.naam} naam={trainer.naam} foto={trainer.foto} trainerType={trainer.trainerType} favorieteOnderdeel={trainer.favorieteOnderdeel} trainerSinds={trainer.favorieteOnderdeel} expertise={trainer.expertise} />
                )}
            </div>
        </div>
    )
}

export default Trainers;