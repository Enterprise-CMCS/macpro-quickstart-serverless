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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts

  useMatch: () => ({
    pathname: "/",
    url: "/",
    params: {},
  }),
}));

describe("Test Header.js", () => {
  test("Check the main element exists", () => {
    useContextMock.mockReturnValue(true);
    const { getByTestId } = render(<Home />);
    expect(getByTestId("Home-Container")).toBeVisible();
  });
});
