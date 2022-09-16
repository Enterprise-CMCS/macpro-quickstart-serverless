import React from "react";
import IdleTimer from "../components/IdleTimer";
import { render, act } from "@testing-library/react";
import { createMocks } from "react-idle-timer";

// mock window.scroll to resolve a 'not implemented' error from a dependency
// https://stephencharlesweiss.com/jest-debugging-not-implemented-errors
window.scroll = jest.fn();

const mockHandleLogout = jest.fn();

beforeAll(() => {
  jest.useFakeTimers();
  createMocks();
});

afterAll(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

let wrapper;
beforeEach(() => {
  wrapper = render(
    <IdleTimer
      handleLogout={mockHandleLogout}
      timeout={2 * 1000}
      promptTimeout={2 * 1000}
    ></IdleTimer>
  );
});

describe("Test IdleTimer.js", () => {
  test("Doesn't render modal before idle timeout is exceeded", () => {
    act(() => jest.advanceTimersByTime(1000));
    expect(wrapper.queryByTestId("timeout-dialog")).not.toBeInTheDocument();
  });

  test("Does render modal after idle timeout is exceeded", () => {
    act(() => jest.advanceTimersByTime(3000));
    expect(wrapper.getByTestId("timeout-dialog")).toBeVisible();
  });

  test("Doesn't call handleLogout before idle timeout + prompt timeout", () => {
    act(() => jest.advanceTimersByTime(3000));
    expect(mockHandleLogout).not.toHaveBeenCalled();
  });

  test("Does call handleLogout after idle timeout + prompt timeout", () => {
    act(() => jest.advanceTimersByTime(5000));
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
