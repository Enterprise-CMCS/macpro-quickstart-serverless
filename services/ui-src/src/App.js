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
import { loader } from "graphql.macro";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  const gqlSchema = loader("../../apollo-lambda/graphql/schema.graphql");
  let fullJWT;
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession().then((res) => {
        let accessToken = res.getAccessToken();
        fullJWT = accessToken.jwtToken;
      });
    } catch (e) {
      onError(e);
    }
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

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const localLogin = config.LOCAL_LOGIN === "true";
      if (localLogin) {
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

  const httpLink = new HttpLink({
    uri: config.apiGraphqlGateway.URL + "/graphql",
  });

  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
      headers: {
        authorization: `Bearer ${fullJWT}`,
      },
    });

    return forward(operation);
  });

  const graphqlClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, httpLink),
    typeDefs: gqlSchema,
  });

  return (
    !isAuthenticating && (
      <ApolloProvider client={graphqlClient}>
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
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </div>
      </ApolloProvider>
    )
  );
}

export default App;
