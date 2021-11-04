import React from "react";
import Amendments from "./Amendments";
import { render, screen, act } from "@testing-library/react";
import { getAmendment } from "../libs/api";

const fileUpload = () => {};
const fileURLResolver = () => new Promise.resolve("mock-attachmenturl");

const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

jest.spyOn(window, "alert").mockImplementation(() => {});

jest.mock("../libs/api", () => {
  return {
    __esModule: true,
    getAmendment: jest.fn(() => ({
      email: "johnDoe@example.com",
    })),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useRouteMatch: () => ({
    path: "/amendments/1",
    params: { id: 1 },
  }),
  useParams: () => ({ id: 1 }),
}));

describe("Test Amendments.js", () => {
  let wrapper;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  beforeEach(async () => {
    wrapper = render(
      <Amendments fileUpload={fileUpload} fileURLResolver={fileURLResolver} />
    );
    await waitForComponentToPaint(wrapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAmendment should be called with id param", () => {
    expect(getAmendment).toHaveBeenCalledWith(1);
  });

  test("Check the main element exists", () => {
    expect(wrapper.getByTestId("amendments-container")).toBeVisible();
  });

  test("If amendment returns values it should set the value of inputs", () => {
    const inputEl = screen.getByTestId("amendments-email");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("value", "johnDoe@example.com");
  });
});
