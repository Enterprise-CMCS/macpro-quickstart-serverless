import React from "react";
import { render } from "@testing-library/react";
import Header from "./Header";

describe("Test Header.js", () => {
  test("Should match snapshot", () => {
    const wrapper = render(<Header />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
