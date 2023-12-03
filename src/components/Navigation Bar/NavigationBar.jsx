import React, {useContext, useState} from "react";
import {
  Link,
  useLocation
} from "react-router-dom";
import Item from "./Item";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import disableScroll from 'disable-scroll';
import wedstrijdText from "../../content/Wedstrijden.json";
import "./NavigationBar.scss"
import getUrl from "../../functions/links";
import authContext from "../../pages/Auth/AuthContext";
import Login from "../Login/Login";

function NavigationBar() {
  const [active, setActive] = useState(false);
  const location = useLocation().pathname;
  const {authState, setAuthState} = useContext(authContext)


  if (active) {
    disableScroll.on();
  } else {
    disableScroll.off();
  }

  return (
    <div id="navBar">
      <nav id="navPc">
        <Link to="/">
          <img id="navLogo" className={(location === "/" ? "hidden" : "")} src={getUrl(`logo.png`)} alt="" />
        </Link>
        <img id="home_logo" className={(location === "/" ? "" : "hidden")} src={getUrl('logo.png')} alt=""/>
        <div id="navItems">
          <Item name="Home" path="/" />
          {/* <Item name="OWee" path="/owee" /> */}
          <Dropdown name="Nieuws" path="/nieuws" items={[{name: "De Spike", path: "/spike", protected: true}]} />
          <Dropdown name="Vereniging" path="/vereniging" items={[{ name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }, { name: "Gezelligheid", path: "/gezelligheid" }, { name: "Arnold", path: "/arnold" }]} />
          <Item name="Trainingen" path="/trainingen" />
          <Dropdown name="Wedstrijden" path="/wedstrijden" items={[{name: "Hoogtepunten", path: "/hoogtepunten"}, {name: "Records", path: "/records"}].concat(wedstrijdText.wedstrijden.filter((wedstrijd) => wedstrijd.path !== "").map((wedstrijd) => ({name: wedstrijd.naam, path: wedstrijd.path})))} />
          <Item name="Word lid!" path="/word_lid" />
          <Dropdown name="Contact" path="/contact" items={[{ name: "Sponsors", path: "/sponsors" }, { name: "VCP", path: "/vcp" }]} />
          {authState.isLoaded && authState.isAuthenticated && <Dropdown name="Leden" path="/leden" items={[{ name: "Verjaardagen", path: "/verjaardagen" }, { name: "Klassementen", path: "/klassementen" }]} />}
        </div>
        <Login />
      </nav>
      <nav id="navMobile">
        <div id="navMobileBar">
          <div className="hamburgerIcon" onClick={() => setActive(!active)}>
            <div className={"hamburgerStreepje" + (active ? " hamburgerTop" : "")}></div>
            <div className={"hamburgerStreepje" + (active ? " hamburgerMiddle" : "")}></div>
            <div className={"hamburgerStreepje" + (active ? " hamburgerBottom" : "")}></div>
          </div>
          {/* <img id="navMobileLogo" src={getUrl(`dodeka.png`)} alt="" /> */}
          <div className="mobileLogin">
            <Login />
          </div>
        </div>
        <div id="navMobileContainer" className={active ? "" : " inactive"}>
          <div className={active ? "" : "inactive"}>
            <Item name="Home" path="/" onClick={() => setActive(false)} />
            {/* <Item name="OWee" path="/owee" onClick={() => setActive(false)} /> */}
            {(!authState.isLoaded || !authState.isAuthenticated )&&
              <Item name="Nieuws" path="/nieuws" onClick={() => setActive(false)} />
            } 
            {authState.isLoaded && authState.isAuthenticated && 
              <MobileDropdown name="Nieuws" path="/nieuws" items={[{name: "Nieuwsarchief", path: ""}, { name: "De Spike", path: "/spike" }]} onClick={() => setActive(false)} />
            }
            <MobileDropdown name="Vereniging" path="/vereniging" items={[{name: "Informatie", path: ""}, { name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }, { name: "Gezelligheid", path: "/gezelligheid" }, { name: "Arnold", path: "/arnold" }]} onClick={() => setActive(false)} />
            <Item name="Trainingen" path="/trainingen" onClick={() => setActive(false)} />
            <MobileDropdown name="Wedstrijden" path="/wedstrijden" items={[{name: "Eigen wedstrijden", path: ""}, {name: "Hoogtepunten", path: "/hoogtepunten"}, {name: "Records", path: "/records"}].concat(wedstrijdText.wedstrijden.filter((wedstrijd) => wedstrijd.path !== "").map((wedstrijd) => ({name: wedstrijd.naam, path: wedstrijd.path})))} onClick={() => setActive(false)} />
            <Item name="Word lid!" path="/word_lid" onClick={() => setActive(false)} />
            <MobileDropdown name="Contact" path="/contact" items={[{name: "Contactinformatie", path: ""}, { name: "Sponsors", path: "/sponsors" }, { name: "VCP", path: "/vcp" }]} onClick={() => setActive(false)} />
            {authState.isLoaded && authState.isAuthenticated && <MobileDropdown name="Leden" path="/leden" items={[{ name: "Verjaardagen", path: "/verjaardagen" }, { name: "Klassementen", path: "/klassementen" }]} onClick={() => setActive(false)}/>}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavigationBar;