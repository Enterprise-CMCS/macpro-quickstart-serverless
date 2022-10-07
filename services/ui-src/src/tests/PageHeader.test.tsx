import React from "react";
import { PageHeader } from "../components/PageHeader";
import { render, within } from "@testing-library/react";

describe("Test PageHeader.js", () => {
  test("Check that PageHeader had correct className", () => {
    const { container } = render(<PageHeader />);
    expect(container.firstChild).toHaveClass("page-header");
  });

  test("renders child text", () => {
    const { getByTestId } = render(<PageHeader>Hello World</PageHeader>);
    const { getByText } = within(getByTestId("page-header"));
    expect(getByText("Hello World")).toBeInTheDocument();
  });
});
