import { config } from "dotenv";

enum AppEnv {
  Development = "development",
  Production = "production",
}

interface EnvConfig {
  region: string;
  endpoint: string;
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

function checkEnvVariablesAreSet(env: AppEnv): void {
  // if env is not Development, check if the .env file exists
  if (env !== AppEnv.Development) {
    config();
    // check if all the environment variables are set
    const requiredEnvVars: Array<keyof EnvConfig> = ["region", "endpoint"];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing ${envVar} environment variable`);
      }
    }
  }
}

function getEnvConfig(): EnvConfig {
  const env = checkAppEnv();
  checkEnvVariablesAreSet(env);
  // create object with read values from environment variables
  // this will only be reached if the env is Development else above check will throw error
  const defaultConfig: EnvConfig = {
    region: process.env.region || "us-east-1",
    endpoint: process.env.endpoint || "localstack:4566",
  };
  return defaultConfig;
}

const appEnvConfig = getEnvConfig();
export default appEnvConfig;
