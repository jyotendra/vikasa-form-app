import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import appEnvConfig, { AppEnv, isDevelopment } from "./env-loader";
import cors from "@fastify/cors";

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
    ...(isDevelopment && {
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

  void fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow requests from all origins in development mode
      if (isDevelopment || !origin) {
        cb(null, true);
      } else if (isDevelopment && origin.includes("localhost")) {
        // Allow localhost in development mode
        cb(null, true);
      } else {
        // In production, you can restrict origins as needed
        const allowedOrigins = [
          "https://your-production-domain.com",
          "http://localhost:3000", // Example for local development
        ];
        if (allowedOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error("Not allowed by CORS"), false);
        }
      }
    },
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: options,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "authed-routes"),
    dirNameRoutePrefix: function rewrite(folderParent, folderName) {
      // Only apply prefix to the root level, not nested folders
      if (folderParent === join(__dirname, "authed-routes")) {
        return "api";
      }
      return false; // No prefix for nested folders
    },
    autoHooks: true,
    cascadeHooks: true,
    options: opts,
    forceESM: false,
    maxDepth: 10,
    matchFilter: (path) =>
      path.endsWith(".route.ts") || path.endsWith(".route.js"),
  });

  console.log(fastify.printRoutes());
};

export default app;
export { app, appOptions as options };
