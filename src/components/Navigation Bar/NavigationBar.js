import React from "react";
import Logo from "../../images/.ComCom.jpg";
import Item from "./Item";
import Dropdown from "./Dropdown";

function NavigationBar() {
  return (
    <nav class="sticky top-0 flex w-full h-24 bg-blauw mx-auto items-center z-50">
      <h1 class="ml-16 font-bold text-white text-5xl align-text-bottom">DSAV Dodeka</h1>
      <img class="mx-8 h-16 w-16" src={Logo} alt="" />
      <Item name="Home" path="/" />
      <Item name="Nieuws" path="/nieuws" />
      <Dropdown name="Over" path="/over" items={[{name: "Bestuur", path: "/bestuur"}, {name: "Commissies", path: "/commissies"}, {name: "Merchandise", path: "/merchandise"}, {name: "Arnold", path: "/arnold"}]}/>
      <Item name="Trainingen" path="/trainingen" />
      <Item name="Wedstrijden" path="/wedstrijden" />
      <Item name="Agenda" path="/agenda" />
      <Item name="Contact" path="/contact" />
    </nav>
  )
}

export default NavigationBar;