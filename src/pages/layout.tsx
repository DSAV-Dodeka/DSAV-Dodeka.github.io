import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import NavigationBar from "../components/Navigation Bar/NavigationBar";
import ContactBar from "../components/Contact Bar/ContactBar";
import KeyboardNav from "../components/KeyboardNav";
import DevOriginWarning from "../components/DevOriginWarning";
import "./layout.css";

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div id="app_screen">
      <DevOriginWarning />
      <KeyboardNav />
      <div id="app_container">
        <NavigationBar />
        <div id="app_flex">
          <Outlet />
          <div id="app_flex_grow" />
          <ContactBar />
        </div>
      </div>
    </div>
  );
}
