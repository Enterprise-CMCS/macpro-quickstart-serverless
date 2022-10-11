import LoaderButton from "../components/LoaderButton";
import { render, within } from "@testing-library/react";

describe("Test LoaderButton.js", () => {
  test("Check that LoaderButton had correct classNames and renders correct child text", () => {
    const { container, getByTestId } = render(
      <LoaderButton>Submit</LoaderButton>
    );
    expect(container.firstChild).toHaveClass("d-grid");
    expect(container.firstChild).toHaveClass("mt-4");
    const { getByText } = within(getByTestId("loader-button"));
    expect(getByText("Submit")).toBeInTheDocument();
  });
});
