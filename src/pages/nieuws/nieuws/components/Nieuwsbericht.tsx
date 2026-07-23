import { useEffect, useState } from "react";
import Title from "./Title";
import TrackBackground from "./TrackElements";
import "./Nieuwsbericht.scss";
import { getHashedImageUrl } from "$functions/links";

interface NieuwsberichtProps {
  id: string;
  titel: string;
  datum: string;
  auteur: string;
  tekst: string;
  foto: string;
  page: string;
  position: "left" | "right";
}

function Nieuwsbericht(props: NieuwsberichtProps) {
  // useEffect required: window is unavailable during SSR/prerender.
  const [width, setWidth] = useState(1920);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return (
    <div id={props.id} className="nieuwsbericht_1">
      <TrackBackground seed={props.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)} />
      {props.position === "left" || width <= 1023 ? (
        <div className="nieuwsbericht_img_outer">
          <div className="nieuwsbericht_img_wrap">
            <img
              className="nieuwsbericht_2"
              src={getHashedImageUrl(`/${props.page}/${props.foto}`)}
              alt=""
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="nieuwsbericht_3">
        <div className="nieuwsbericht_3_inner">
        <Title title={props.titel.toUpperCase()} position={props.position} />
        <p
          className={
            "nieuwsbericht_4" +
            (props.position === "left" ? " textLeft" : " textRight")
          }
        >
          {props.datum} | {props.auteur}
        </p>
        <p className="nieuwsbericht_5">
          {props.tekst.split("\n").map((item, index) => (
            <span key={props.id + index}>
              {item}
              <br />
            </span>
          ))}
        </p>
        </div>
      </div>
      {props.position === "left" || width <= 1023 ? (
        ""
      ) : (
        <div className="nieuwsbericht_img_outer">
          <div className="nieuwsbericht_img_wrap">
            <img
              className="nieuwsbericht_6"
              src={getHashedImageUrl(`/${props.page}/${props.foto}`)}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Nieuwsbericht;
