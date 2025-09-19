import { Outlet } from "react-router";
import NavigationBar from "../components/Navigation Bar/NavigationBar";
import ContactBar from "../components/Contact Bar/ContactBar";
import "./layout.css";

export default function AppLayout() {
  return (
    <div id="app_screen">
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
