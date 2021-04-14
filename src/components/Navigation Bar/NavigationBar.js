import React, { useState } from "react";
import Item from "./Item";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import disableScroll from 'disable-scroll';
import logo from "../../images/logo.png";
import logo2 from "../../images/dsav.png";
import logo3 from "../../images/odeka.png";

function NavigationBar() {
  const [active, setActive] = useState(false);

  if (active) {
    disableScroll.on();
  } else {
    disableScroll.off();
  }

  return (
    <div class="sticky top-0 z-50">
      <nav class="hidden lg:flex w-full h-24 bg-blauw mx-auto items-center z-50">
        <img class="mt-8 w-16 bg-blauw rounded-b-full ml-16" src={logo2} alt=""/>
        <img class="w-32 bg-blauw ml-1 mr-16" src={logo3} alt=""/>
        <Item name="Home" path="/" />
        <Item name="Nieuws" path="/nieuws" />
        <Dropdown name="Over" path="/over" items={[{ name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }, { name: "Merchandise", path: "/merchandise" }, { name: "Arnold", path: "/arnold" }]} />
        <Item name="Trainingen" path="/trainingen" />
        <Item name="Wedstrijden" path="/wedstrijden" />
        <Item name="Agenda" path="/agenda" />
        <Item name="Word Lid" path="/word_lid" />
        <Item name="Contact" path="/contact" />
      </nav>
      <nav class="lg:hidden w-full bg-blauw z-10">
        <div class="flex h-16 px-4 items-center">
          <div class="inline space-y-2 cursor-pointer" onClick={() => setActive(!active)}>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform -rotate-45 translate-y-3" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " opacity-0" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform rotate-45 -translate-y-3" : "")}></div>
          </div>
          <div class="flex-grow" />
          <img class="w-32 mx-16" src={logo3} alt=""/>
          <div class="flex-grow" />
          <div class="inline space-y-2 cursor-pointer invisible">
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform -rotate-45 translate-y-3" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " opacity-0" : "")}></div>
            <div class={"bg-white h-1 w-8 rounded transition duration-500" + (active ? " transform rotate-45 -translate-y-3" : "")}></div>
          </div>
        </div>
        <div class={"fixed top-16 w-screen h-screen transition duration-500 bg-blauw transform" + (active ? "" : " opacity-0 hidden")}>
          <div class={active ? "" : "hidden"}>
            <Item name="Home" path="/" onClick={() => setActive(false)}/>
            <Item name="Nieuws" path="/nieuws" onClick={() => setActive(false)}/>
            <MobileDropdown name="Over" path="/over" items={[{ name: "Bestuur", path: "/bestuur" }, { name: "Commissies", path: "/commissies" }, { name: "Merchandise", path: "/merchandise" }, { name: "Arnold", path: "/arnold" }]} onClick={() => setActive(false)}/>
            <Item name="Trainingen" path="/trainingen" onClick={() => setActive(false)}/>
            <Item name="Wedstrijden" path="/wedstrijden" onClick={() => setActive(false)}/>
            <Item name="Agenda" path="/agenda" onClick={() => setActive(false)}/>
            <Item name="Word Lid" path="/word_lid" onClick={() => setActive(false)}/>
            <Item name="Contact" path="/contact" onClick={() => setActive(false)}/>
          </div>
        </div> 
      </nav>
    </div>
  )
}

export default NavigationBar;