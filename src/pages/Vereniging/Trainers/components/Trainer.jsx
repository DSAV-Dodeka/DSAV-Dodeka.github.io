import Header from "../../../../components/Header";
import "./Trainer.scss";
import {getDeepImagesUrl} from "../../../../functions/links";

function Trainer(props) {
    return(
        <div className="trainerContainer">
        <div className="trainerPhotoContainer">
            <img className="trainerPhoto" src={`/src/images/commissies/trainers/${props.foto}`} />
        </div>
            <div className="trainerText">
                <Header text={props.naam} position="left"></Header>
                <div className="trainer-detail-list">
                    <div className="trainer-type">{props.trainerType}</div>
                    <div className="favoriete-onderdeel trainer-detail">{props.favorieteOnderdeel}</div>
                    <div className="trainer-sinds trainer-detail">{props.trainerSinds}</div>
                    <div className="expertise trainer-detail">{props.expertise}</div>
                </div>
            </div>
        </div>
    )
}

export default Trainer;