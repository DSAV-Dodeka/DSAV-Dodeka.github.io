import Header from "../../../../components/Header";
import "./Trainer.scss";
import {getDeepImagesUrl} from "../../../../functions/links";

interface TrainerProps {
    key: string;
    naam: string;
    foto: string;
    trainerType: string;
    favorieteOnderdeel: string;
    trainerSinds: string;
    expertise: string;
}

function Trainer({key, naam, foto, trainerType, favorieteOnderdeel, trainerSinds, expertise}: TrainerProps) {
    return(
        <div className="trainerContainer">
        <div className="trainerPhotoContainer">
            <img className="trainerPhoto" src={getDeepImagesUrl(foto)} />
        </div>
            <div className="trainerText">
                <Header text={naam} position="left"></Header>
                <div className="trainer-detail-list">
                    <div className="trainer-type">{trainerType}</div>
                    <div className="favoriete-onderdeel trainer-detail">{favorieteOnderdeel}</div>
                    <div className="trainer-sinds trainer-detail">{trainerSinds}</div>
                    <div className="expertise trainer-detail">{expertise}</div>
                </div>
            </div>
        </div>
    )
}

export default Trainer;