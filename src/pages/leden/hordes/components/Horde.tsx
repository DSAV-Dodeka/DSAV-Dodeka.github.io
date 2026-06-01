import { getHashedImageUrl } from "$functions/links";
import "./Horde.scss";

export interface HordeProps {
    naam: string;
    tekst: string;
    foto: string;
    join?: string;
}

const Horde = ({ naam, tekst, join, foto }: HordeProps) => {
    return (
        <div className="horde_card">
            <img className="horde_img" src={getHashedImageUrl(`leden/hordes/${foto}`)} alt={naam} />
            <p className="horde_naam">{naam}</p>
            <p className="horde_content">{tekst}</p>
            {join && (
                <a className="horde_join" href={join} target="_blank" rel="noreferrer">
                    Join deze horde
                </a>
            )}
        </div>
    );
};

export default Horde;
