import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import appEnvConfig, { AppEnv } from "./env-loader";

interface AwsOptions {
  region: string;
  localstackEndpoint?: string;
  cognitoLocalEndpoint?: string;
  cognitoUserPoolId: string;
  cognitoClientId: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {
  aws: AwsOptions;
  appEnv: AppEnv;
}
const appOptions: AppOptions = {
  aws: {
    region: appEnvConfig.AWS_REGION,
    cognitoUserPoolId: appEnvConfig.COGNITO_USER_POOL_ID,
    cognitoClientId: appEnvConfig.COGNITO_CLIENT_ID,
    awsAccessKeyId: appEnvConfig.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: appEnvConfig.AWS_SECRET_ACCESS_KEY,
    ...(appEnvConfig.APP_ENV === AppEnv.Development && {
      localstackEndpoint: appEnvConfig.LOCALSTACK_ENDPOINT,
      cognitoLocalEndpoint: appEnvConfig.COGNITO_ENDPOINT,
    }),
  },
  appEnv: appEnvConfig.APP_ENV,
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  const options = { ...appOptions, ...opts };

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: options,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    dirNameRoutePrefix: function rewrite() {
      return "api";
    },
    options: opts,
  });
};

export default app;
export { app, appOptions as options };
