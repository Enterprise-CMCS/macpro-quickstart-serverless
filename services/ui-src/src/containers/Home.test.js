import React from "react";
import Home from "./Home";
import { render } from "@testing-library/react";

let realUseContext;
let useContextMock;

// *** set up mocksP
beforeEach(() => {
  realUseContext = React.useContext;
  useContextMock = React.useContext = jest.fn();
});

// *** garbage clean up (mocks)
afterEach(() => {
  React.useContext = realUseContext;
});

describe("Test Header.js", () => {
  test("Check the main element, with classname user-profiles, exists", () => {
    useContextMock.mockReturnValue(true);
    const { getByTestId } = render(<Home />);
    expect(getByTestId("Home-Container")).toBeVisible();
  });
});
