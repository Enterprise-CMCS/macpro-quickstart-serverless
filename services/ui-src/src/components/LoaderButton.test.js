import React from "react";
import LoaderButton from "./LoaderButton";
import { render, within } from "@testing-library/react";

describe("Test LoaderButton.js", () => {
  test("Check that LoaderButton had correct classNames", () => {
    const { container } = render(<LoaderButton />);
    expect(container.firstChild).toHaveClass("d-grid");
    expect(container.firstChild).toHaveClass("mt-4");
  });

  test("renders child text", () => {
    const { getByTestId } = render(<LoaderButton>Submit</LoaderButton>);
    const { getByText } = within(getByTestId("loader-button"));
    expect(getByText("Submit")).toBeInTheDocument();
  });
});
