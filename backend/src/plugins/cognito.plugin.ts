import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { AppOptions } from "../app";
import { isDevelopment } from "../env-loader";
import { createCogitoClient } from "../config/cognito.config";

const cognitoPlugin: FastifyPluginAsync<AppOptions> = async (
  fastify,
  options
) => {
  const clientParams = {
    region: options.aws.region,
    ...(isDevelopment && {
      endpoint: options.aws.cognitoLocalEndpoint,
    }),
  };
  const cognitoClient = createCogitoClient(clientParams);

  fastify.decorate("cognito", cognitoClient);

  fastify.addHook("onClose", (instance, done) => {
    if (cognitoClient) {
      cognitoClient.destroy();
    }
    done();
  });
};

export default fp(cognitoPlugin, {
  name: "cognito",
});

declare module "fastify" {
  interface FastifyInstance {
    cognito: CognitoIdentityProviderClient;
  }
}
