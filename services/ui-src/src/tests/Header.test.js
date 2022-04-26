import React from "react";
import { render } from "@testing-library/react";
import Header from "../components/Header";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addEventListener: function () {},
      removeEventListener: function () {},
    };
  };

describe("Test Header.js", () => {
  test("Should match snapshot", () => {
    expect(render(<Header />).asFragment()).toMatchSnapshot();
  });
});
