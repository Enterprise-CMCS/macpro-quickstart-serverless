import React from "react";
import { render } from "@testing-library/react";
import Header from "../components/Header";

describe("Test Header.js", () => {
  test("Should match snapshot", () => {
    expect(render(<Header />).asFragment()).toMatchSnapshot();
  });
});
