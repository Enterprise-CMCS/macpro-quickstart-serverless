import React, { useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { Dialog } from "@cmsgov/design-system";

let promptIntervalId;

function IdleTimer(props) {
  const [remaining, setRemaining] = useState(props.promptTimeout / 1000);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    return () => {
      clearInterval(promptIntervalId);
    };
  }, []);

  const handleOnPrompt = () => {
    const tick = () => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    };
    clearInterval(promptIntervalId);
    promptIntervalId = setInterval(tick, 1000);
    setModalIsOpen(true);
  };

  const handleOnIdle = () => {
    clearInterval(promptIntervalId);
    setModalIsOpen(false);
    props.handleLogout();
  };

  const handleStayActive = () => {
    activate();
    setModalIsOpen(false);
  };

  const { activate, getRemainingTime } = useIdleTimer({
    timeout: props.timeout,
    promptTimeout: props.promptTimeout,
    onPrompt: handleOnPrompt,
    onIdle: handleOnIdle,
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

  return (
    modalIsOpen && (
      <Dialog
        onExit={handleStayActive}
        underlayClickExits={true}
        closeIcon={null}
        closeButtonText={""}
      >
        <h2>Session Timeout</h2>
        <p>
          Your session is about to expire due to inactivity. You will be
          automatically signed out in {remaining} seconds.
        </p>
        <button
          className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
          onClick={handleStayActive}
        >
          Stay Signed In
        </button>
      </Dialog>
    )
  );
}

export default IdleTimer;
