import { describe, it } from "node:test";
import assert from "node:assert";
import { build } from "../helper";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";

describe("app should have dbClient", () => {
  it("dynamoDb client should be able to query DB", async (t) => {
    const app = await build(t);
    const response = await app.dynamodb.send(new ListTablesCommand({}));
    console.log(response);
    assert.strictEqual(
      response.TableNames?.length,
      0,
      "Expected no tables initially"
    );
  });
});
