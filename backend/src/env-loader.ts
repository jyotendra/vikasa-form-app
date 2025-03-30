import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

export enum AppEnv {
  Development = "development",
  Production = "production",
  CI = "ci",
}

interface EnvConfig {
  AWS_REGION: string;
  LOCALSTACK_ENDPOINT: string;
  COGNITO_ENDPOINT: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_CLIENT_ID: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  APP_ENV: AppEnv;
}

function loadEnvFile(env: AppEnv): void {
  // Only look for .env file in development environment
  if (env === AppEnv.Development) {
    const envFile = `.env.dev`;
    const envPath = resolve(process.cwd(), envFile);

    if (existsSync(envPath)) {
      console.log(`Loading environment from ${envFile}`);
      config({ path: envPath });
    } else {
      throw new Error(`Missing ${envFile} file for development environment`);
    }
  }
  // In production and CI, rely on environment variables from Docker/system
  // i.e no .env file will be provided in the filesystem
  checkEnvVariablesAreSet(env);
}

function checkEnvVariablesAreSet(env: AppEnv): void {
  // check if all the environment variables are set
  let requiredEnvVars: Array<keyof EnvConfig> = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ];
  if (env === AppEnv.Development) {
    requiredEnvVars = [
      ...requiredEnvVars,
      "LOCALSTACK_ENDPOINT",
      "COGNITO_ENDPOINT",
      "COGNITO_USER_POOL_ID",
      "COGNITO_CLIENT_ID",
    ];
  }
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing ${envVar} environment variable`);
    }
  }
}

function getEnvConfig(): EnvConfig {
  const env = checkAppEnv();
  if (env === AppEnv.Development && !process.env.DOCKER_UP) {
    // load this only when running locally; not via docker-compose
    loadEnvFile(env);
  }
  const envConfig: EnvConfig = {
    AWS_REGION: process.env.AWS_REGION!,
    LOCALSTACK_ENDPOINT: process.env.LOCALSTACK_ENDPOINT || "",
    COGNITO_ENDPOINT: process.env.COGNITO_ENDPOINT || "",
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID!,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    APP_ENV: env,
  };
  return envConfig;
}

function checkAppEnv(): AppEnv {
  // check the NODE_ENV environment variable to determine the environment
  const env = process.env.NODE_ENV || AppEnv.Development;

  // check the env is available as option in the enum
  if (!Object.values(AppEnv).includes(env as AppEnv)) {
    throw new Error(`Invalid environment ${env}`);
  }

  return env as AppEnv;
}

const appEnvConfig = getEnvConfig();

export const isDevelopment = appEnvConfig.APP_ENV === AppEnv.Development;
export default appEnvConfig;
