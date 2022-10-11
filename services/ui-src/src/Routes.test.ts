import { routes } from "./Routes";

const expected = [
  "Home: /",
  "Profile: /profile",
  "New Amendment: /amendments/new",
  "View Amendment: /amendments/:id",
  "Not Found: undefined",
];

describe("Test Routes", () => {
  test("correct routes are exported", () => {
    expect(routes.map(({ name, path }) => `${name}: ${path}`)).toEqual(
      expected
    );
  });
});
