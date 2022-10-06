import React from "react";
import { UsaBanner } from "@cmsgov/design-system";
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap";
import { CMSLogo } from "./CMSLogo";

function Header({ handleLogout, isAuthenticated, handleLogin }) {
  return (
    <>
      <UsaBanner />
      <Navbar className="nav-bar">
        <Container>
          <Navbar.Brand href="/">
            <CMSLogo />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {isAuthenticated ? (
              <NavDropdown title="My Account">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link onClick={handleLogin}>Login</Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
