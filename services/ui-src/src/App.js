import { LinkContainer } from "react-router-bootstrap";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import { loginLocalUser } from "./libs/user";
import config from "./config";
function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/");
  }

  function loginLocal() {
    const alice = {
      username: "alice",
      attributes: {
        given_name: "Alice",
        family_name: "Foo",
        email: "alice@example.com",
      },
    };
    loginLocalUser(alice);
    userHasAuthenticated(true);
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const localLogin = config.LOCAL_LOGIN === "true";
      if (localLogin) {
        loginLocal();
      } else {
        const authConfig = Auth.configure();
        const { domain, redirectSignIn, responseType } = authConfig.oauth;
        const clientId = authConfig.userPoolWebClientId;
        const url = `https://${domain}/oauth2/authorize?redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;
        window.location.assign(url);
      }
    } catch (e) {
      onError(e);
    }
  }

  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">APS Home</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <NavDropdown id="User" title="My Account">
                    <LinkContainer to="/profile">
                      <NavItem>User Profile</NavItem>
                    </LinkContainer>
                    <NavItem onClick={handleLogout}>Logout</NavItem>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <NavItem onClick={handleLogin}>Login</NavItem>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
