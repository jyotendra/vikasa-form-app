import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import appEnvConfig from "./config/env";

interface AwsOptions {
  region: string;
  endpoint?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
}

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {
  aws: AwsOptions;
}
const appOptions: AppOptions = {
  aws: {
    region: appEnvConfig.region,
    endpoint: appEnvConfig.endpoint,
  },
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
