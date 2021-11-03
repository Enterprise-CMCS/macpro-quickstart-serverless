import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <div className="d-grid mt-4">
      <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <FontAwesomeIcon icon={"refresh"} className="spinning" />}
        {props.children}
      </Button>
    </div>
  );
}
