import {
  ConfirmSignUpCommand,
  CreateUserPoolClientCommand,
  CreateUserPoolCommand,
  ListUsersCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createCongitoClient } from "../src/config/cognito.config";
import appEnvConfig from "../src/env-loader";

console.log(`Using default configuration for ${appEnvConfig}`);

const testEmail = "user@test.com";
const testPassword = "user123";

const testPoolName = "test-user-pool";
const testClientName = "test-client";

const userConfirmationCode = "123456";

const cognitoClient = createCongitoClient({
  region: appEnvConfig.AWS_REGION,
  endpoint: appEnvConfig.COGNITO_ENDPOINT,
});

type PoolCreationResponse = {
  UserPoolId: string;
  ClientId: string;
};

async function setupCognitoOnLocal(): Promise<PoolCreationResponse> {
  // create a user pool
  const createUserPoolCommand = new CreateUserPoolCommand({
    PoolName: testPoolName,
  });

  const createUserPoolResponse = await cognitoClient.send(
    createUserPoolCommand
  );
  const poolId = createUserPoolResponse.UserPool?.Id;
  if (!poolId) {
    throw new Error("User pool not created");
  }
  console.log(`User pool created with id: ${poolId}`);

  // add client to the pool
  const createUserPoolClientCommand = new CreateUserPoolClientCommand({
    ClientName: testClientName,
    UserPoolId: poolId,
  });
  const createUserPoolClientResponse = await cognitoClient.send(
    createUserPoolClientCommand
  );
  const clientId = createUserPoolClientResponse.UserPoolClient?.ClientId;
  if (!clientId) {
    throw new Error("User pool client not created");
  }
  console.log(`User pool client created with id: ${clientId}`);

  return { UserPoolId: poolId, ClientId: clientId };
}

async function setupUser() {
  const poolResponse = await setupCognitoOnLocal();
  // signup user
  const signUpCommand = new SignUpCommand({
    ClientId: poolResponse.ClientId,
    Username: testEmail,
    Password: testPassword,
  });
  const signUpResponse = await cognitoClient.send(signUpCommand);
  console.log("User signed up", signUpResponse);

  // confirm the user
  const confirmSignUpCommand = new ConfirmSignUpCommand({
    ClientId: poolResponse.ClientId,
    Username: testEmail,
    ConfirmationCode: userConfirmationCode,
  });
  const confirmSignUpResponse = await cognitoClient.send(confirmSignUpCommand);
  console.log("User confirmed", confirmSignUpResponse);

  // list all users
  const listUsersCommand = new ListUsersCommand({
    UserPoolId: poolResponse.UserPoolId,
  });
  const listUsersResponse = await cognitoClient.send(listUsersCommand);
  console.log("Users", listUsersResponse.Users);
}

setupUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
