import React from "react";
import { render } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Test Footer.js", () => {
  test("Should match snapshot", () => {
    expect(render(<Footer />).asFragment()).toMatchSnapshot();
  });
});
