import React, {useState} from "react";
import {
    Link,
    useLocation
} from "react-router-dom";
import logo from "../../../images/.ComCom.jpg";

const regularStyle = "absolute h-24 w-32 py-8 text-center text-white hover:bg-white hover:text-blauw text-2xl font-medium";
const activeStyle = "absolute h-24 bg-rood text-white w-32 py-8 text-center text-2xl font-medium";
const dropdownStyle = "block h-16 py-4 w-32 text-center text-white bg-blauw text-white border-white hover:bg-white hover:text-blauw text-lg font-medium";

function NavigationBar() {
    const location = useLocation().pathname;
    const [activeTab, setActiveTab] = useState("none");

    return (
      <nav class="fixed flex w-full h-24 bg-blauw mx-auto items-center z-50">
        <h1 class="ml-16 font-bold text-white text-5xl align-text-bottom">DSAV Dodeka</h1>
        <img class="mx-8 h-16 w-16" src={logo} alt=""/>
        <div class="relative h-24 w-32">
          <Link to="/" class={location === "/" ? activeStyle : regularStyle}>Home</Link>
        </div>
        <div class="relative h-24 w-32">
          <Link to="/nieuws" class={location === "/nieuws" ? activeStyle : regularStyle}>Nieuws</Link>
        </div>
        <div onMouseLeave={() => setActiveTab("none")} class="relative h-24 w-32">
          <Link to="/over" onMouseEnter={() => setActiveTab("over")} class={location.includes("/over") ? activeStyle : regularStyle}>Over</Link>
          <div class={activeTab === "over" ? "absolute left-0 w-32 top-24 z-50" : "hidden"}>
            <Link to="/over/bestuur" class={dropdownStyle}>Bestuur</Link>
            <Link to="/over/commissies" class={dropdownStyle}>Commissies</Link>
            <Link to="/over/merchandise" class={dropdownStyle}>Merchandise</Link>
            <Link to="/over/arnold" class={dropdownStyle + " rounded-b-md"}>Arnold</Link>
          </div>
        </div>
        <div class="relative h-24 w-32">
          <Link to="/trainingen" class={location === "/trainingen" ? activeStyle : regularStyle}>Trainingen</Link>
        </div>
        <div class="relative h-24 w-32">
          <Link to="/wedstrijden" class={location === "/wedstrijden" ? activeStyle : regularStyle}>Wedstrijden</Link>
        </div>
        <div class="relative h-24 w-32">
          <Link to="/agenda" class={location === "/agenda" ? activeStyle : regularStyle}>Agenda</Link>
        </div>
        <div class="relative h-24 w-32">
          <Link to="/contact" class={location === "/contact" ? activeStyle : regularStyle}>Contact</Link>
        </div>
      </nav>
    )
  }

  export default NavigationBar;