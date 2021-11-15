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
          {/* <Item name="OWee" path="/owee" /> */}
          <Item name="Nieuws" path="/nieuws" />
          <Dropdown name="Vereniging" path="/vereniging" items={[{ name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }]} />
          <Item name="Trainingen" path="/trainingen" />
          {/* <Item name="Wedstrijden" path="/wedstrijden" />
        <Item name="Agenda" path="/agenda" /> */}
          <Item name="Word lid!" path="/word_lid" />
          <Dropdown name="Contact" path="/contact" items={[{ name: "Sponsors", path: "/sponsors" }]} />
        </div>
      </nav>
      <nav id="navMobile" class="lg:hidden w-full bg-blauw z-10">
        <div class="flex h-16 px-4 items-center">
          <div class="inline space-y-2 cursor-pointer" onClick={() => setActive(!active)}>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform -rotate-45 translate-y-3" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " opacity-0" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform rotate-45 -translate-y-3" : "")}></div>
          </div>
          <div class="flex-grow" />
          <img class="w-32 mx-16" src={logo} alt="" />
          <div class="flex-grow" />
          <div class="inline space-y-2 cursor-pointer invisible">
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform -rotate-45 translate-y-3" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " opacity-0" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform rotate-45 -translate-y-3" : "")}></div>
          </div>
        </div>
        <div class={"fixed top-16 w-screen h-screen transition duration-500 bg-blauw transform" + (active ? "" : " opacity-0 hidden")}>
          <div class={active ? "" : "hidden"}>
            <Item name="Home" path="/" onClick={() => setActive(false)} />
            {/* <Item name="OWee" path="/owee" onClick={() => setActive(false)} /> */}
            <Item name="Nieuws" path="/nieuws" onClick={() => setActive(false)} />
            <MobileDropdown name="Vereniging" path="/vereniging" items={[{name: "Informatie", path: ""}, { name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }]} onClick={() => setActive(false)} />
            <Item name="Trainingen" path="/trainingen" onClick={() => setActive(false)} />
            {/* <Item name="Wedstrijden" path="/wedstrijden" onClick={() => setActive(false)}/>
            <Item name="Agenda" path="/agenda" onClick={() => setActive(false)}/> */}
            <Item name="Word lid!" path="/word_lid" onClick={() => setActive(false)} />
            <MobileDropdown name="Contact" path="/contact" items={[{name: "Contactinformatie", path: ""}, { name: "Sponsors", path: "/sponsors" }]} onClick={() => setActive(false)} />
            
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavigationBar;