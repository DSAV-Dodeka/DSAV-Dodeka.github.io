import { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import "./Commissie.scss";
import { getHashedImageUrl } from "../../../../functions/links";

interface CommissieLid {
  naam: string;
  foto: string;
  functie: string;
}

interface CommissieProps {
  name: string;
  fotos: string;
  info: string;
  leden: CommissieLid[];
  position: string;
}

function Commissie(props: CommissieProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function slideIn() {
    const element = document.getElementById(props.name);
    if (element) {
      element.classList.add("out");
      element.classList.remove("in");
    }

    const scrollContainer = document.getElementById(props.name + "scroll");
    if (scrollContainer) {
      const scrollWidth =
        scrollContainer.scrollWidth - scrollContainer.offsetWidth;
      scrollContainer.scrollTo(1, 0);
      const scroll = setInterval(() => {
        if (
          scrollContainer.scrollLeft !== scrollWidth &&
          scrollContainer.scrollLeft !== 0
        ) {
          scrollContainer.scrollTo(scrollContainer.scrollLeft + 1, 0);
        } else {
          clearInterval(scroll);
        }
      }, 15);
    }
  }

  function slideOut() {
    const element = document.getElementById(props.name);
    if (element) {
      element.classList.remove("out");
      element.classList.add("in");
    }
  }

  return props.position === "left" || (isClient && window.innerWidth <= 1023) ? (
    <div id={props.name} className="commissieContainer">
      <img
        className="commissieLogo roundedRight"
        src={getHashedImageUrl(`commissies/${props.fotos}/logo.webp`)}
        alt=""
      />
      <div className="commissieInfo roundedLeft">
        <Header text={props.name} position="left" />
        <p className="commissieStukje">{props.info}</p>
        <div className="commissieSlider" onClick={() => slideIn()}>
          <p className="commissieSliderMargin">Bekijk de leden</p>
          <svg
            id=""
            xmlns="http://www.w3.org/2000/svg"
            className="commissieArrow"
            viewBox="0 0 24 24"
          >
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
        </div>
      </div>

      <div className="commissieLogo roundedRight">
        <img
          className="commissieFoto roundedRight"
          src={getHashedImageUrl(`commissies/${props.fotos}/commissie.webp`)}
          alt=""
        />
      </div>

      <div className="commissieInfo roundedLeft">
        <Header text={props.name + " leden"} position="left" />
        <div id={props.name + "scroll"} className="commissieLeden">
          {props.leden.map((lid) => (
            <div key={props.name + lid.naam} className="commissieLid">
              <img
                className="commissieLidFoto"
                src={getHashedImageUrl(
                  `commissies/${props.fotos}/${lid.foto}.webp`,
                )}
                alt=""
              />
              <p className="commissieLidNaam">{lid.naam}</p>
              <p className="commissieLidFunctie">{lid.functie}</p>
            </div>
          ))}
        </div>
        <div className="commissieSlider" onClick={() => slideOut()}>
          <svg
            id=""
            xmlns="http://www.w3.org/2000/svg"
            className="commissieArrow reverseArrow commissieSliderMargin"
            viewBox="0 0 24 24"
          >
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
          <p>Bekijk de commissie</p>
        </div>
      </div>
    </div>
  ) : (
    <div id={props.name} className="commissieContainer">
      <div className="commissieInfo roundedRight inverseMargin">
        <Header text={props.name} position="left" />
        <p className="commissieStukje">{props.info}</p>
        <div className="commissieSlider" onClick={() => slideIn()}>
          <p className="commissieSliderMargin">Bekijk de leden</p>
          <svg
            id=""
            xmlns="http://www.w3.org/2000/svg"
            className="commissieArrow"
            viewBox="0 0 24 24"
          >
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
        </div>
      </div>
      <img
        className={"commissieLogo roundedLeft"}
        src={getHashedImageUrl(`commissies/${props.fotos}/logo.webp`)}
        alt=""
      />

      <div className="commissieInfo roundedRight inverseMargin">
        <Header text={props.name + " leden"} position="left" />
        <div id={props.name + "scroll"} className="commissieLeden">
          {props.leden.map((lid) => (
            <div key={props.name + lid.naam + "2"} className="commissieLid">
              <img
                className="commissieLidFoto"
                src={getHashedImageUrl(
                  `commissies/${props.fotos}/${lid.foto}.webp`,
                )}
                alt=""
              />
              <p className="commissieLidNaam">{lid.naam}</p>
              <p className="commissieLidFunctie">{lid.functie}</p>
            </div>
          ))}
        </div>
        <div className="commissieSlider" onClick={() => slideOut()}>
          <svg
            id=""
            xmlns="http://www.w3.org/2000/svg"
            className="commissieArrow reverseArrow commissieSliderMargin"
            viewBox="0 0 24 24"
          >
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
          <p>Bekijk de commissie</p>
        </div>
      </div>

      <div className="commissieLogo roundedLeft">
        <img
          className="commissieFoto roundedLeft"
          src={getHashedImageUrl(`commissies/${props.fotos}/commissie.webp`)}
          alt=""
        />
      </div>
    </div>
  );
}

export default Commissie;
