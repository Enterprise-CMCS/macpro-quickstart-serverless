import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { loginLocalUser } from "./libs/user";
import Routes from "./Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import config from "./config";
import { useIdleTimer } from "react-idle-timer";
import Modal from "react-modal";
import { Dialog } from "@cmsgov/design-system";

Modal.setAppElement("#root");

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [remaining, setRemaining] = useState(props.promptTimeout);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const history = useHistory();

  const handleOnActive = () => {
    console.log("Active");
  };

  let promptInterval;
  const handleOnPrompt = () => {
    console.log("Opening Modal");
    setModalIsOpen(true);

    const tick = () => setRemaining(Math.ceil(getRemainingTime() / 1000));

    clearInterval(promptInterval);
    promptInterval = setInterval(tick, 1000);
  };

  const handleOnIdle = () => {
    clearInterval(promptInterval);
    setModalIsOpen(false);
    handleLogout();
  };

  const stayActive = () => {
    setModalIsOpen(false);
    activate();
  };

  const {
    start,
    reset,
    pause,
    activate,
    resume,
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime,
  } = useIdleTimer({
    timeout: 5000,
    promptTimeout: 5000,
    onActive: handleOnActive,
    onPrompt: handleOnPrompt,
    onIdle: handleOnIdle,
    startManually: true,
    startOnMount: false,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
  });

  useEffect(() => {
    onLoad();
    const intervalID = setInterval(() => {
      console.log("Remaining time: ", getRemainingTime());
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  async function onLoad() {
    console.log("Called onLoad");
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
    reset();
    pause();
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
      console.log("Called start");
      start();
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
        {modalIsOpen && (
          <Dialog
            onExit={stayActive}
            underlayClickExits={true}
            closeIcon={null}
            closeButtonText={""}
          >
            <h2>Session Timeout</h2>
            <p>
              Your session is about to expire due to inactivity. You will be
              automatically logged out in {remaining} seconds.
            </p>
            <button
              className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
              key="solid"
              onClick={stayActive}
            >
              Stay Signed In
            </button>
          </Dialog>
        )}
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
          <Footer />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
