import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { createDynamoDBClient } from "../config/dynamodb.config";
import { AppOptions } from "../app";
import { AppEnv } from "../env-loader";

const dynamoDBPlugin: FastifyPluginAsync<AppOptions> = async (
  fastify,
  options
) => {
  const docClient = createDynamoDBClient({
    region: options.aws.region,
    ...(options.appEnv === AppEnv.Development && {
      endpoint: options.aws.localstackEndpoint,
    }),
  });

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
