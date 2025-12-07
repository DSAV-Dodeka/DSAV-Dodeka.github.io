import { useState } from "react";
import Nieuwsbericht from "../nieuws/components/Nieuwsbericht";
import SpikeText from "../../../content/Spike.json";
import "./Spike.scss";
import logo from "$images/spike/logo.png";

function Spike() {
  const [nBerichten, setNBerichten] = useState(3);

  return (
    <div className="spikeContainer">
      <div className="spikeLogoContainer">
        <img
          src={logo}
          alt="De Spike"
          className="spike_1"
        />
      </div>
      {/*{!authState.isAuthenticated && (
                <p className="spike_status">Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken.</p>
            )}*/}
      {true && (
        <>
          <div
            className={
              "spike_2" +
              (nBerichten >= SpikeText.nieuwsberichten.length ? " spike_3" : "")
            }
          >
            {SpikeText.nieuwsberichten
              .slice(0, nBerichten)
              .map((bericht, index) => (
                <Nieuwsbericht
                  id={bericht.titel}
                  key={bericht.titel}
                  position={index % 2 === 0 ? "left" : "right"}
                  page="spike"
                  titel={bericht.titel}
                  datum={bericht.datum}
                  auteur={bericht.auteur}
                  tekst={bericht.tekst}
                  foto={bericht.foto}
                />
              ))}
          </div>

          <button
            onClick={() => setNBerichten(nBerichten + 3)}
            className={
              "spike_4" +
              (nBerichten >= SpikeText.nieuwsberichten.length ? " hidden" : "")
            }
          >
            LAAD MEER
          </button>
        </>
      )}
    </div>
  );
}

export default Spike;
