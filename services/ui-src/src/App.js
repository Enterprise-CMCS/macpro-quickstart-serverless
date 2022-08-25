import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { loginLocalUser } from "./libs/user";
import Routes from "./Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import config from "./config";

// TODO: GIT Test remove
// TODO: GIT Test remove
// TODO: GIT Test remove
// TODO: GIT Test remove

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
        await Auth.federatedSignIn();
      }
    } catch (e) {
      onError(e);
    }
  }

  return (
    !isAuthenticating && (
      <div id="app-wrapper">
        <Header
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          handleLogin={handleLogin}
        />
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
          <Footer />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
