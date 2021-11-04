import React from "react";
import { render } from "@testing-library/react";
import Footer from "./Footer";

describe("Test Footer.js", () => {
  test("Should match snapshot", () => {
    const wrapper = render(<Footer />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
