export const AppEnv = {
  REACT_APP_AWS_REGION: process.env.REACT_APP_AWS_REGION,
  REACT_APP_LOCALSTACK_ENDPOINT: process.env.REACT_APP_LOCALSTACK_ENDPOINT,
  REACT_APP_COGNITO_ENDPOINT: process.env.REACT_APP_COGNITO_ENDPOINT,
  REACT_APP_COGNITO_USER_POOL_ID: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  REACT_APP_COGNITO_CLIENT_ID: process.env.REACT_APP_COGNITO_CLIENT_ID,
  REACT_APP_AWS_ACCESS_KEY_ID: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
};

export enum NodeEnvEnum {
  Development = "development",
  Production = "production",
}

export const NODE_ENV = process.env.NODE_ENV as NodeEnvEnum;

export const validateEnvVariables = (): void => {
  const missingEnvVars = Object.entries(AppEnv)
    .filter(([key, value]) => !value) // Check if the value is undefined or empty
    .map(([key]) => key); // Collect the keys of missing variables

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }

  if (!NODE_ENV) {
    throw new Error("Missing required environment variable: NODE_ENV");
  }
};
