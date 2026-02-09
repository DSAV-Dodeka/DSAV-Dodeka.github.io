import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import Item from "./Item";
import Dropdown from "./Dropdown";
import MobileDropdown from "./MobileDropdown";
import disableScroll from "disable-scroll";
import wedstrijdText from "../../content/Wedstrijden.json";
import { useSessionInfo } from "$functions/query.ts";
import "./NavigationBar.scss";
import "./animation.css";
import logo from "$images/logo.png";
import dodeka from "$images/dodeka.png";
import LoginIndicator from "../LoginIndicator/LoginIndicator";

// Client-only component that renders the Leden menu when the user is a member.
// useSessionInfo (react-query) cannot run during SSR since QueryClientProvider
// is only mounted on the client.
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

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;
  return <>{children}</>;
}

function NavigationBar() {
  const [active, setActive] = useState(false);
  const location = useLocation().pathname;

  useEffect(() => {
    if (active) {
      disableScroll.on();
    } else {
      disableScroll.off();
    }
  }, []);

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
              { name: "Sponsors", path: "/sponsors" },
              { name: "VCP", path: "/vcp" },
              { name: "Donateurs", path: "/donateurs" },
            ]}
          />
          <ClientOnly>
            <MemberDropdown />
          </ClientOnly>
        </div>
        <LoginIndicator />
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
          <img id="navMobileLogo" src={dodeka} alt="" />
          <div className="mobileLogin">
            <LoginIndicator />
          </div>
        </div>
        <div id="navMobileContainer" className={active ? "" : " inactive"}>
          <div className={active ? "" : "inactive"}>
            <Item name="Home" path="/" onClick={() => setActive(false)} />
            {/* <Item name="OWee" path="/owee" onClick={() => setActive(false)} /> */}
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
                { name: "Reglementen", path: "/reglementen" },
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
                { name: "Donateurs", path: "/donateurs" },
              ]}
              onClick={() => setActive(false)}
            />
            <ClientOnly>
              <MemberMobileDropdown onClick={() => setActive(false)} />
            </ClientOnly>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
