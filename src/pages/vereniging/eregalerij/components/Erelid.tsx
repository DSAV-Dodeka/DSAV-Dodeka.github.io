import "./Erelid.scss";
import { getHashedImageUrl } from "../../../../functions/links";

interface ErelidProps {
  naam: string;
  redenen: string[];
  foto: string;
  showdetails: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Erelid({
  naam,
  redenen,
  foto,
  showdetails,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ErelidProps) {
  return (
    <div
      className={`erelid ${showdetails ? "showdetails" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        className="erelid_foto"
        src={getHashedImageUrl(foto)}
      />
      <p className="erelid_naam">{naam}</p>
      <div className="erelid_info">
        {redenen.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </div>
    </div>
  );
}

export default Erelid;
