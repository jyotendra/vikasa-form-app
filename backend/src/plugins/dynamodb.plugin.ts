import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { createDynamoDBClient } from "../config/dynamodb.config";
import { AppOptions } from "../app";
import { isDevelopment } from "../env-loader";

const dynamoDBPlugin: FastifyPluginAsync<AppOptions> = async (
  fastify,
  options
) => {
  const clientParams = {
    region: options.aws.region,
    ...(isDevelopment && {
      endpoint: options.aws.localstackEndpoint,
    }),
  };
  const docClient = createDynamoDBClient(clientParams);

  fastify.decorate("dynamodb", docClient);

  fastify.addHook("onClose", (instance, done) => {
    done();
  });
};

export default fp(dynamoDBPlugin, {
  name: "dynamodb",
});

declare module "fastify" {
  interface FastifyInstance {
    dynamodb: ReturnType<typeof createDynamoDBClient>;
  }
}
