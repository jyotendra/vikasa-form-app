const envVar = import.meta.env;
export const AppEnv = {
  VITE_AWS_REGION: envVar.VITE_AWS_REGION,
  VITE_LOCALSTACK_ENDPOINT: envVar.VITE_LOCALSTACK_ENDPOINT,
  VITE_COGNITO_ENDPOINT: envVar.VITE_COGNITO_ENDPOINT,
  VITE_COGNITO_USER_POOL_ID: envVar.VITE_COGNITO_USER_POOL_ID,
  VITE_COGNITO_CLIENT_ID: envVar.VITE_COGNITO_CLIENT_ID,
  VITE_AWS_ACCESS_KEY_ID: envVar.VITE_AWS_ACCESS_KEY_ID,
  VITE_AWS_SECRET_ACCESS_KEY: envVar.VITE_AWS_SECRET_ACCESS_KEY,
};

export enum NodeEnvEnum {
  Development = "dev",
  Production = "prod",
}

export const NODE_ENV = envVar.MODE as NodeEnvEnum;

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
