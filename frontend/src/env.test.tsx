import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { AppEnv } from "./helpers/env";

describe("renders learn react link", () => {
  test("checks if environment variables are set", () => {
    render(<App />);
    console.log("Environment Variables:", AppEnv);

    Object.values(AppEnv).forEach((value) => {
      expect(value).toBeDefined();
      expect(value).not.toBe("");
    });
  });
});
