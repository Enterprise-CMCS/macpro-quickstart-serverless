import React from "react";
import { UsaBanner } from "@cmsgov/design-system";
import * as Bootstrap from "react-bootstrap";
import { CMSLogo } from "./CMSLogo";

function Header({ handleLogout, isAuthenticated, handleLogin }) {
  return (
    <>
      <UsaBanner />
      <Bootstrap.Navbar className="nav-bar">
        <Bootstrap.Container>
          <Bootstrap.Navbar.Brand href="/">
            <CMSLogo />
          </Bootstrap.Navbar.Brand>
          <Bootstrap.Navbar.Toggle />
          <Bootstrap.Navbar.Collapse className="justify-content-end">
            {isAuthenticated ? (
              <Bootstrap.NavDropdown title="My Account">
                <Bootstrap.NavDropdown.Item href="/profile">
                  Profile
                </Bootstrap.NavDropdown.Item>
                <Bootstrap.NavDropdown.Item onClick={ handleLogout }>
                  Logout
                </Bootstrap.NavDropdown.Item>
              </Bootstrap.NavDropdown>
            ) : (
              <Bootstrap.Nav.Link onClick={ handleLogin }>Login</Bootstrap.Nav.Link>
            )}
          </Bootstrap.Navbar.Collapse>
        </Bootstrap.Container>
      </Bootstrap.Navbar>
    </>
  );
}

export default Header;
