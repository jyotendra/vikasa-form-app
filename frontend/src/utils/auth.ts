import {
  AuthenticationResultType,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { AppEnv, APP_MODE, NodeEnvEnum } from "../helpers/env";
import { writableUserAuthAtom, userAtomKey } from "../store/authAtoms";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { globalAppStore } from "../store/globalStore";

const cognitoConfig: CognitoIdentityProviderClientConfig = {
  region: AppEnv.VITE_AWS_REGION,
  credentials: {
    accessKeyId: AppEnv.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: AppEnv.VITE_AWS_SECRET_ACCESS_KEY!,
  },
};

if (APP_MODE === NodeEnvEnum.Development) {
  cognitoConfig.endpoint = AppEnv.VITE_COGNITO_ENDPOINT;
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
        ClientId: AppEnv.VITE_COGNITO_CLIENT_ID,
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

const getStoredAuthResult = (): AuthenticationResultType | null => {
  const authResult = localStorage.getItem(userAtomKey);
  if (authResult) {
    try {
      return JSON.parse(authResult);
    } catch (error) {
      console.error("Failed to parse stored auth result:", error);
      return null;
    }
  }
  return null;
};

export const getUserAccessToken = () => {
  const storedAuthResult = getStoredAuthResult();
  if (storedAuthResult && storedAuthResult.AccessToken) {
    return storedAuthResult.AccessToken;
  }
  return null;
};

export const clearUserAuth = () => {
  globalAppStore.set(writableUserAuthAtom, null);
};
