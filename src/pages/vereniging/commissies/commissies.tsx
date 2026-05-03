import PageTitle from "$components/PageTitle";
import Commissie from "./components/Commissie";
import CommissiesText from "$content/Commissies.json";
import "./commissies.scss";
import { getHashedImageUrl } from "$functions/links";

function Commissies() {
  const scrollToCommissie = (name: string) => {
    const element = document.getElementById(name);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div>
      <PageTitle title="Commissies" />
      <div className="commissieNav">
        {CommissiesText.commissies.map((commissie) => (
          <div
            key={commissie.naam}
            className="commissieNavItem"
            onClick={() => scrollToCommissie(commissie.naam)}
          >
            <img
              src={getHashedImageUrl(`commissies/${commissie.fotos}/logo.webp`)}
              alt=""
            />
            <p>{commissie.naam}</p>
          </div>
        ))}
      </div>
      <div className="commissies overflow-x-hidden mb-16 lg:mb-24">
        {CommissiesText.commissies.map((commissie, index) => (
          <Commissie
            key={commissie.naam}
            position={index % 2 === 0 ? "left" : "right"}
            name={commissie.naam}
            info={commissie.info}
            leden={commissie.leden}
            fotos={commissie.fotos}
          />
        ))}
      </div>
    </div>
  );
}

export default Commissies;
