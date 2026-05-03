import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import Item from "./Item";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import disableScroll from "disable-scroll";
import wedstrijdText from "$content/Wedstrijden.json";
import { useSessionInfo } from "$functions/query.ts";
import "./NavigationBar.scss";
import "./animation.css";
import logo from "$images/logo.png";
import dodeka from "$images/dodeka.png";
import LoginIndicator from "../LoginIndicator/LoginIndicator";

// Renders the Leden menu only after the session query confirms membership.
function MemberDropdown() {
  const { data: session } = useSessionInfo();
  const isMember = session?.user.permissions.includes("member") ?? false;
  if (!isMember) return null;
  return (
    <Dropdown
      name="Leden"
      path="/leden"
      items={[{ name: "Verjaardagen", path: "/verjaardagen" }]}
    />
  );
}

function MemberMobileDropdown({ onClick }: { onClick: () => void }) {
  const { data: session } = useSessionInfo();
  const isMember = session?.user.permissions.includes("member") ?? false;
  if (!isMember) return null;
  return (
    <MobileDropdown
      name="Leden"
      path="/leden"
      items={[
        { name: "Ledenpagina", path: "" },
        { name: "Verjaardagen", path: "/verjaardagen" },
      ]}
      onClick={onClick}
    />
  );
}

function MobileNieuws({ onClick }: { onClick: () => void }) {
  const { data: session } = useSessionInfo();
  const isMember = session?.user.permissions.includes("member") ?? false;
  if (isMember) {
    return (
      <MobileDropdown
        name="Nieuws"
        path="/nieuws"
        items={[
          { name: "Nieuws", path: "" },
          { name: "De Spike", path: "/spike" },
        ]}
        onClick={onClick}
      />
    );
  }
  return <Item name="Nieuws" path="/nieuws" onClick={onClick} />;
}

function NavigationBar() {
  const [active, setActive] = useState(false);
  const location = useLocation().pathname;

  const toggleActive = () => {
    const next = !active;
    setActive(next);
    if (next) {
      disableScroll.on();
    } else {
      disableScroll.off();
    }
  };

  const closeMenu = () => {
    setActive(false);
    disableScroll.off();
  };

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
          {/* <Item name="OWee" path="/owee" /> */}
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
              { name: "Samenwerking", path: "/sponsors" },
              { name: "VCP", path: "/vcp" },
              { name: "Donateurs", path: "/donateurs" },
            ]}
          />
          <MemberDropdown />
        </div>
        <LoginIndicator />
      </nav>
      <nav id="navMobile">
        <div id="navMobileBar">
          <div className="hamburgerIcon" onClick={toggleActive}>
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
          <img id="navMobileLogo" src={dodeka} alt="" />
          <div className="mobileLogin">
            <LoginIndicator />
          </div>
        </div>
        <div id="navMobileContainer" className={active ? "" : " inactive"}>
          <div className={active ? "" : "inactive"}>
            <Item name="Home" path="/" onClick={closeMenu} />
            {/* <Item name="OWee" path="/owee" onClick={closeMenu} /> */}
            <MobileNieuws onClick={closeMenu} />
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
                { name: "Reglementen", path: "/reglementen" },
              ]}
              onClick={closeMenu}
            />
            <MobileDropdown
              name="Trainingen"
              path="/trainingen"
              items={[
                { name: "Trainingen", path: "" },
                { name: "Trainers", path: "/trainers" },
                { name: "Trainers gezocht", path: "/gezocht" },
              ]}
              onClick={closeMenu}
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
              onClick={closeMenu}
            />
            <Item name="Word lid!" path="/word_lid" onClick={closeMenu} />
            <MobileDropdown
              name="Contact"
              path="/contact"
              items={[
                { name: "Contactinformatie", path: "" },
                { name: "Samenwerking", path: "/sponsors" },
                { name: "VCP", path: "/vcp" },
                { name: "Donateurs", path: "/donateurs" },
              ]}
              onClick={closeMenu}
            />
            <MemberMobileDropdown onClick={closeMenu} />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
