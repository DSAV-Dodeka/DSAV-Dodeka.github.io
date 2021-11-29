import React, { useState } from "react";
import {
  Link,
  useLocation
} from "react-router-dom";
import Item from "./Item";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import disableScroll from 'disable-scroll';
import logo from "../../images/dodeka.png";
import dodeka from "../../images/logo.png";
import "./NavigationBar.scss"

function NavigationBar() {
  const [active, setActive] = useState(false);
  const location = useLocation().pathname;

  if (active) {
    disableScroll.on();
  } else {
    disableScroll.off();
  }

  return (
    <div id="navBar">
      <nav id="navPc">
        <Link to="/">
          <img id="navLogo" class={(location === "/" ? "hidden" : "")} src={dodeka} alt="" />
        </Link>
        <div id="navItems">
          <Item name="Home" path="/" />
          <Item name="Nieuws" path="/nieuws" />
          <Dropdown name="Vereniging" path="/vereniging" items={[{ name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }]} />
          <Item name="Trainingen" path="/trainingen" />
          <Item name="Word lid!" path="/word_lid" />
          <Dropdown name="Contact" path="/contact" items={[{ name: "Sponsors", path: "/sponsors" }]} />
        </div>
      </nav>
      <nav id="navMobile">
        <div id="navMobileBar">
          <div class="hamburgerIcon" onClick={() => setActive(!active)}>
            <div class={"hamburgerStreepje" + (active ? " hamburgerTop" : "")}></div>
            <div class={"hamburgerStreepje" + (active ? " hamburgerMiddle" : "")}></div>
            <div class={"hamburgerStreepje" + (active ? " hamburgerBottom" : "")}></div>
          </div>
          <div class="navSpacing" />
          <img id="navMobileLogo" src={logo} alt="" />
          <div class="navSpacing" />
          <div class="hamburgerIconInvisible">
          <div class={"hamburgerStreepje" + (active ? " hamburgerTop" : "")}></div>
            <div class={"hamburgerStreepje" + (active ? " hamburgerMiddle" : "")}></div>
            <div class={"hamburgerStreepje" + (active ? " hamburgerBottom" : "")}></div>
          </div>
        </div>
        <div id="navMobileContainer" class={active ? "" : " inactive"}>
          <div class={active ? "" : "inactive"}>
            <Item name="Home" path="/" onClick={() => setActive(false)} />
            <MobileDropdown name="Vereniging" path="/vereniging" items={[{name: "Informatie", path: ""}, { name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }]} onClick={() => setActive(false)} />
            <Item name="Trainingen" path="/trainingen" onClick={() => setActive(false)} />
            <Item name="Word lid!" path="/word_lid" onClick={() => setActive(false)} />
            <MobileDropdown name="Contact" path="/contact" items={[{name: "Contactinformatie", path: ""}, { name: "Sponsors", path: "/sponsors" }]} onClick={() => setActive(false)} />
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavigationBar;