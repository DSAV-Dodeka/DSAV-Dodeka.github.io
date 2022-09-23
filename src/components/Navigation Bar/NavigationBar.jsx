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

function NavigationBar() {
  const [active, setActive] = useState(false);
  const location = useLocation().pathname;
  const [counter, setCounter]  = useState(0);
  const {authState, setAuthState} = useContext(authContext)

  function count() {
    if (counter === 11) {
      setCounter(0);
      var win = window.open("https://nl.wikipedia.org/wiki/12_(getal)", '_blank');
      win.focus();
    } else {
      setCounter(counter + 1);
    }
  }

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
        <img id="home_logo" className={(location === "/" ? "" : "hidden")} onClick={() => count()} src={getUrl('logo.png')} alt=""/>
        <div id="navItems">
          <Item name="Home" path="/" />
          <Item name="Nieuws" path="/nieuws" />
          <Dropdown name="Vereniging" path="/vereniging" items={[{ name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }, { name: "Arnold", path: "/arnold" }]} />
          <Item name="Trainingen" path="/trainingen" />
          <Dropdown name="Wedstrijden" path="/wedstrijden" items={wedstrijdText.wedstrijden.filter((wedstrijd) => wedstrijd.path !== "").map((wedstrijd) => ({name: wedstrijd.naam, path: wedstrijd.path})).concat([{name: "Records", path: "/records"}])} />
          <Item name="Word lid!" path="/word_lid" />
          <Dropdown name="Contact" path="/contact" items={[{ name: "Sponsors", path: "/sponsors" }]} />
          <Item name="Account" path="/profile" />
          {authState.scope.includes("admin") && (<Item name="Admin" path="/admin" />)}
        </div>
      </nav>
      <nav id="navMobile">
        <div id="navMobileBar">
          <div className="hamburgerIcon" onClick={() => setActive(!active)}>
            <div className={"hamburgerStreepje" + (active ? " hamburgerTop" : "")}></div>
            <div className={"hamburgerStreepje" + (active ? " hamburgerMiddle" : "")}></div>
            <div className={"hamburgerStreepje" + (active ? " hamburgerBottom" : "")}></div>
          </div>
          <div className="navSpacing" />
          <img id="navMobileLogo" src={getUrl(`dodeka.png`)} alt="" />
          <div className="navSpacing" />
          <div className="hamburgerIconInvisible">
          <div className={"hamburgerStreepje" + (active ? " hamburgerTop" : "")}></div>
            <div className={"hamburgerStreepje" + (active ? " hamburgerMiddle" : "")}></div>
            <div className={"hamburgerStreepje" + (active ? " hamburgerBottom" : "")}></div>
          </div>
        </div>
        <div id="navMobileContainer" className={active ? "" : " inactive"}>
          <div className={active ? "" : "inactive"}>
            <Item name="Home" path="/" onClick={() => setActive(false)} />
            <Item name="Nieuws" path="/nieuws" onClick={() => setActive(false)} />
            <MobileDropdown name="Vereniging" path="/vereniging" items={[{name: "Informatie", path: ""}, { name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }, { name: "Arnold", path: "/arnold" }]} onClick={() => setActive(false)} />
            <Item name="Trainingen" path="/trainingen" onClick={() => setActive(false)} />
            <MobileDropdown name="Wedstrijden" path="/wedstrijden" items={[{name: "Eigen wedstrijden", path: ""}].concat(wedstrijdText.wedstrijden.filter((wedstrijd) => wedstrijd.path !== "").map((wedstrijd) => ({name: wedstrijd.naam, path: wedstrijd.path}))).concat([{name: "Records", path: "/records"}])} onClick={() => setActive(false)} />
            <Item name="Word lid!" path="/word_lid" onClick={() => setActive(false)} />
            <MobileDropdown name="Contact" path="/contact" items={[{name: "Contactinformatie", path: ""}, { name: "Sponsors", path: "/sponsors" }]} onClick={() => setActive(false)} />
            <Item name="Account" path="/profile" onClick={() => setActive(false)} />
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavigationBar;