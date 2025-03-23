import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";

export function createCongitoClient(
  config: CognitoIdentityProviderClientConfig
) {
  const client = new CognitoIdentityProviderClient({
    region: config.region,
    endpoint: config.endpoint,
  });

  return client;
}
