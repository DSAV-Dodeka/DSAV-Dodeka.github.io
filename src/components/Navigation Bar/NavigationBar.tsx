import { useState } from "react";
import { Link, useLocation } from "react-router";
import Item from "./Item";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import disableScroll from "disable-scroll";
import wedstrijdText from "../../content/Wedstrijden.json";
import "./NavigationBar.scss";
import logo from "$images/logo.png";
import { isClient } from "../../functions/sizes";

function NavigationBar() {
  const [active, setActive] = useState(false);
  const location = useLocation().pathname;

  if (isClient()) {
    if (active) {
      disableScroll.on();
    } else {
      disableScroll.off();
    }
  }

  return (
    <div id="navBar">
      <nav id="navPc">
        <Link to="/">
          <img
            id="navLogo"
            className={location === "/" ? "hidden" : ""}
            src={logo}
            alt=""
          />
        </Link>
        <img
          id="home_logo"
          className={location === "/" ? "" : "hidden"}
          src={logo}
          alt=""
        />
        <div id="navItems">
          <Item name="Home" path="/" />
          <Item name="OWee" path="/owee" />
          <Dropdown
            name="Nieuws"
            path="/nieuws"
            items={[{ name: "De Spike", path: "/spike", protected: true }]}
          />
          <Dropdown
            name="Vereniging"
            path="/vereniging"
            items={[
              { name: "Bestuur", path: "/bestuur" },
              { name: "Commissies", path: "/commissies" },
              { name: "Gezelligheid", path: "/gezelligheid" },
              { name: "Eregalerij", path: "/eregalerij" },
              { name: "Arnold", path: "/arnold" },
              { name: "OLD", path: "/old" },
              { name: "Reglementen", path: "/reglementen" },
            ]}
          />
          <Dropdown
            name="Trainingen"
            path="/trainingen"
            items={[
              { name: "Trainers", path: "/trainers" },
              { name: "Trainers gezocht", path: "/gezocht" },
            ]}
          />
          <Dropdown
            name="Wedstrijden"
            path="/wedstrijden"
            items={[
              { name: "Hoogtepunten", path: "/hoogtepunten" },
              { name: "Records", path: "/records" },
            ].concat(
              wedstrijdText.wedstrijden
                .filter((wedstrijd) => wedstrijd.path !== "")
                .map((wedstrijd) => ({
                  name: wedstrijd.naam,
                  path: wedstrijd.path,
                })),
            )}
          />
          <Item name="Word lid!" path="/word_lid" />
          <Dropdown
            name="Contact"
            path="/contact"
            items={[
              { name: "Sponsors", path: "/sponsors" },
              { name: "VCP", path: "/vcp" },
            ]}
          />
          {/*{authState.isLoaded && authState.isAuthenticated && <Dropdown name="Leden" path="/leden" items={[{ name: "Verjaardagen", path: "/verjaardagen" }, { name: "Klassementen", path: "/klassementen" }]} />}*/}
        </div>
      </nav>
      <nav id="navMobile">
        <div id="navMobileBar">
          <div className="hamburgerIcon" onClick={() => setActive(!active)}>
            <div
              className={"hamburgerStreepje" + (active ? " hamburgerTop" : "")}
            ></div>
            <div
              className={
                "hamburgerStreepje" + (active ? " hamburgerMiddle" : "")
              }
            ></div>
            <div
              className={
                "hamburgerStreepje" + (active ? " hamburgerBottom" : "")
              }
            ></div>
          </div>
          {/* <img id="navMobileLogo" src={getNestedImagesUrl(`dodeka.png`)} alt="" /> */}
          <div className="mobileLogin">{/*<Login />*/}</div>
        </div>
        <div id="navMobileContainer" className={active ? "" : " inactive"}>
          <div className={active ? "" : "inactive"}>
            <Item name="Home" path="/" onClick={() => setActive(false)} />
            <Item name="OWee" path="/owee" onClick={() => setActive(false)} />
            <Item
              name="Nieuws"
              path="/nieuws"
              onClick={() => setActive(false)}
            />
            {/*{authState.isLoaded && authState.isAuthenticated &&
              <MobileDropdown name="Nieuws" path="/nieuws" items={[{name: "Nieuwsarchief", path: ""}, { name: "De Spike", path: "/spike" }]} onClick={() => setActive(false)} />
            }*/}
            <MobileDropdown
              name="Vereniging"
              path="/vereniging"
              items={[
                { name: "Informatie", path: "" },
                { name: "Bestuur", path: "/bestuur" },
                { name: "Commissies", path: "/commissies" },
                { name: "Gezelligheid", path: "/gezelligheid" },
                { name: "Eregalerij", path: "/eregalerij" },
                { name: "Arnold", path: "/arnold" },
                { name: "OLD", path: "/old" },
              ]}
              onClick={() => setActive(false)}
            />
            <MobileDropdown
              name="Trainingen"
              path="/trainingen"
              items={[
                { name: "Trainingen", path: "" },
                { name: "Trainers", path: "/trainers" },
                { name: "Trainers gezocht", path: "/gezocht" },
              ]}
              onClick={() => setActive(false)}
            />
            <MobileDropdown
              name="Wedstrijden"
              path="/wedstrijden"
              items={[
                { name: "Eigen wedstrijden", path: "" },
                { name: "Hoogtepunten", path: "/hoogtepunten" },
                { name: "Records", path: "/records" },
              ].concat(
                wedstrijdText.wedstrijden
                  .filter((wedstrijd) => wedstrijd.path !== "")
                  .map((wedstrijd) => ({
                    name: wedstrijd.naam,
                    path: wedstrijd.path,
                  })),
              )}
              onClick={() => setActive(false)}
            />
            <Item
              name="Word lid!"
              path="/word_lid"
              onClick={() => setActive(false)}
            />
            <MobileDropdown
              name="Contact"
              path="/contact"
              items={[
                { name: "Contactinformatie", path: "" },
                { name: "Sponsors", path: "/sponsors" },
                { name: "VCP", path: "/vcp" },
              ]}
              onClick={() => setActive(false)}
            />
            {/*{authState.isLoaded && authState.isAuthenticated && <MobileDropdown name="Leden" path="/leden" items={[{ name: "Verjaardagen", path: "/verjaardagen" }, { name: "Klassementen", path: "/klassementen" }]} onClick={() => setActive(false)}/>}*/}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
