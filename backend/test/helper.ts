// This file contains code that we reuse between our tests.
const helper = require("fastify-cli/helper.js");
import * as path from "node:path";
import * as test from "node:test";
import { FastifyInstance } from "fastify";
import { createDynamoDBClient } from "../src/config/dynamodb.config";
import { createCogitoClient } from "../src/config/cognito.config";

export type TestContext = {
  after: typeof test.after;
};

// redeclaring module seems like a hack,
// it should have already resolved correctly from the src/plugins/**/*.ts
// but it doesn't, so we have to redeclare it here
// TODO: revisit this later
declare module "fastify" {
  interface FastifyInstance {
    dynamodb: ReturnType<typeof createDynamoDBClient>;
    cognito: ReturnType<typeof createCogitoClient>;
  }
}

const AppPath = path.join(__dirname, "..", "src", "app.ts");

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {
    skipOverride: true, // Register our application with fastify-plugin
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext): Promise<FastifyInstance> {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app: FastifyInstance = await helper.build(argv, config());

  // Tear down our app after we are done
  t.after(() => void app.close());

  return app;
}

export { config, build };
