import { describe, it } from "node:test";
import assert from "node:assert";
import { build } from "../helper";
import {
  InitiateAuthCommand,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import appConfig from "../../src/env-loader";

describe("cognito plugin tests", () => {
  it("cognito should be able to list all registered users", async (t) => {
    const app = await build(t);
    const cognitoClient = app.cognito;
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: appConfig.COGNITO_USER_POOL_ID,
    });
    const listUsersResponse = await cognitoClient.send(listUsersCommand);
    console.log(listUsersResponse);
    assert.strictEqual(
      listUsersResponse.Users?.length,
      1,
      "One user should be seeded initially"
    );
  });

  it("cognito should allow a user to login and return a JWT token", async (t) => {
    const app = await build(t);
    const cognitoClient = app.cognito;

    const initiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: appConfig.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: "user@test.com", // these were seeded in the setup-cognito.ts script
        PASSWORD: "user123",
      },
    });

    const authResponse = await cognitoClient.send(initiateAuthCommand);
    console.log(authResponse);

    assert.ok(
      authResponse.AuthenticationResult?.IdToken,
      "JWT token should be returned upon successful login"
    );
  });
});
