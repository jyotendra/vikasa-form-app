import { describe, it } from "node:test";
import assert from "node:assert";
import { build } from "../helper";

describe("app should have dbClient", () => {
  it("should be a function", async (t) => {
    const app = await build(t);
    assert.ok(app.dynamodb);
  });
});
