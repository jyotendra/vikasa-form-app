import { describe, it } from "node:test";
import assert from "node:assert";
import { build } from "fastify-cli/helper";
import { AppOptions } from "../../src/app";

declare module "fastify" {
  interface FastifyInstance {
    dynamodb: DynamoDBDocumentClient; // Replace `any` with the actual type of `dynamodb` if known
  }
}
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

describe("app should have dbClient", () => {
  it("should be a function", async (t) => {
    const builtEntryFile = ["dist/app.js"];
    const opts: AppOptions = {
      aws: {
        region: "us-west-2",
        endpoint: "http://localhost:8000",
      },
    };
    const app = await build(builtEntryFile, {
      skipOverride: true, // important since we want the application to be registered with fastify-plugin
      ...opts,
    });
    assert.ok(app.dynamodb);
    t.after(() => app.close());
  });
});
