import { describe, it } from "node:test";
import assert from "node:assert";
import { build } from "fastify-cli/helper";

describe("app should have dbClient", () => {
  it("should be a function", async (t) => {
    const builtEntryFile = ["dist/app.js"];

    const app = await build(builtEntryFile, {
      skipOverride: true, // important since we want the application to be registered with fastify-plugin
    });
    assert.ok(app.dynamodb);
    t.after(() => app.close());
  });
});
