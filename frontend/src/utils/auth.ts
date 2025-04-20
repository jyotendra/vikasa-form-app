import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { AppEnv, NODE_ENV, NodeEnvEnum } from "../helpers/env";
import { writableUserAuthAtom } from "../store/authAtoms";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";

const cognitoConfig: CognitoIdentityProviderClientConfig = {
  region: AppEnv.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: AppEnv.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: AppEnv.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
};

if (NODE_ENV === NodeEnvEnum.Development) {
  cognitoConfig.endpoint = AppEnv.REACT_APP_COGNITO_ENDPOINT;
}

const cognitoClient = new CognitoIdentityProviderClient(cognitoConfig);

export const useCognitoAuth = () => {
  const [, setUserAuthValue] = useAtom(writableUserAuthAtom);
  const { enqueueSnackbar } = useSnackbar();

  const authenticateUser = async (
    email: string,
    password: string
  ): Promise<InitiateAuthCommandOutput | void> => {
    try {
      const signInCommand = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: AppEnv.REACT_APP_COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const cognitoResponse = await cognitoClient.send(signInCommand);
      return cognitoResponse;
    } catch (error) {
      handleError(error);
    }
  };

  const handleSuccessfulLogin = (authResult: InitiateAuthCommandOutput) => {
    const { AuthenticationResult } = authResult;
    if (AuthenticationResult) {
      setUserAuthValue(AuthenticationResult);
      enqueueSnackbar("Login successful", {
        variant: "success",
        autoHideDuration: 3000,
      });
    }
  };

  const handleChallenge = (loginResponse: InitiateAuthCommandOutput) => {
    // TODO: maybe redirect to a new password page
  };

  const handleError = (err: unknown) => {
    console.error("Error during sign in:", err);
    enqueueSnackbar("Login failed", {
      variant: "error",
      autoHideDuration: 3000,
    });
    // TODO: handle error, maybe redirect to a login page and show a snackbar
  };

  return {
    authenticateUser,
    handleSuccessfulLogin,
    handleChallenge,
  };
};
