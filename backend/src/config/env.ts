import { config } from "dotenv";

enum AppEnv {
  Development = "development",
  Production = "production",
  CI = "ci",
}

interface EnvConfig {
  region: string;
  endpoint: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

type envToConfigMap = {
  [key in AppEnv]: EnvConfig;
};

function configureAwsCredentials(envConfig: EnvConfig): void {
  process.env.AWS_ACCESS_KEY_ID = envConfig.AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = envConfig.AWS_SECRET_ACCESS_KEY;
}

function getDefaultConfig(): EnvConfig {
  const env: AppEnv = checkAppEnv();

  if (env === AppEnv.Production) {
    checkEnvVariablesAreSet();
  }
  const defaults: envToConfigMap = {
    [AppEnv.Development]: {
      region: "us-east-1",
      endpoint: "http://localhost:4566",
      AWS_ACCESS_KEY_ID: "dev",
      AWS_SECRET_ACCESS_KEY: "dev",
    },
    [AppEnv.Production]: {
      region: process.env.region || "",
      endpoint: process.env.endpoint || "",
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    [AppEnv.CI]: {
      region: "eu-central-1",
      endpoint: "localstack:4566",
      AWS_ACCESS_KEY_ID: "ci",
      AWS_SECRET_ACCESS_KEY: "ci",
    },
  };

  if (env === AppEnv.Development || env === AppEnv.CI) {
    configureAwsCredentials(defaults[env]);
    console.log(`Using default configuration for ${env}`);
  }

  return defaults[env];
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

function checkEnvVariablesAreSet(): void {
  config();
  // check if all the environment variables are set
  const requiredEnvVars: Array<keyof EnvConfig> = ["region", "endpoint"];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing ${envVar} environment variable`);
    }
  }
}

const appEnvConfig = getDefaultConfig();
export default appEnvConfig;
