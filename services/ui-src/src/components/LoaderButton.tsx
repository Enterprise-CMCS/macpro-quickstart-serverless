import { Button } from "react-bootstrap";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}: any) {
  return (
    <div className="d-grid mt-4" data-testid="loader-button">
      <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? "Loading..." : props.children}
      </Button>
    </div>
  );
}
