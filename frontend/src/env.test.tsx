import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("renders learn react link", () => {
  test("checks if environment variables are set", () => {
    render(<App />);
    const envVariables = {
      REACT_APP_AWS_REGION: process.env.REACT_APP_AWS_REGION,
      REACT_APP_LOCALSTACK_ENDPOINT: process.env.REACT_APP_LOCALSTACK_ENDPOINT,
      REACT_APP_COGNITO_ENDPOINT: process.env.REACT_APP_COGNITO_ENDPOINT,
      REACT_APP_COGNITO_USER_POOL_ID:
        process.env.REACT_APP_COGNITO_USER_POOL_ID,
      REACT_APP_COGNITO_CLIENT_ID: process.env.REACT_APP_COGNITO_CLIENT_ID,
      REACT_APP_AWS_ACCESS_KEY_ID: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      REACT_APP_AWS_SECRET_ACCESS_KEY:
        process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    };

    console.log("Environment Variables:", envVariables);

    Object.values(envVariables).forEach((value) => {
      expect(value).toBeDefined();
      expect(value).not.toBe("");
    });
  });
});
