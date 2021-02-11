import React from "react";
import {
    Link,
    useLocation
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../../images/.ComCom.jpg";
import "./NavigationBar.css"

function NavigationBar() {

    //Get the current path of the website.
    const location = useLocation();
    
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand id="brand"as={Link} to="/">
          DSAV`40{' '}
          <img
            src={logo}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt=""/>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav id="tabs" variant="pills" activeKey={location.pathname}>
            <Nav.Link eventKey="/" id="tab" as={Link} to="/">Home</Nav.Link>
            <Nav.Link eventKey="/nieuws" as={Link} to="/nieuws">Nieuws</Nav.Link>
            <Nav.Link eventKey="/over" as={Link} to="/over">Over</Nav.Link>
            <Nav.Link eventKey="/trainingen" as={Link} to="/trainingen">Trainingen</Nav.Link>
            <Nav.Link eventKey="/wedstrijden" as={Link} to="/wedstrijden">Wedstrijden</Nav.Link>
            <Nav.Link eventKey="/agenda" as={Link} to="/agenda">Agenda</Nav.Link>
            <Nav.Link eventKey="/word_lid" as={Link} to="/word_lid">Word lid!</Nav.Link>
            <Nav.Link eventKey="/contact" as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </Navbar>
    )
  }

  export default NavigationBar;