import { spawn } from "child_process";
import { upOne } from "docker-compose";
import { join as pathJoin } from "path";

const composePath = pathJoin(__dirname, "..", "..");

// start the localstack service and wait for it to be ready
async function startLocalstack() {
  console.log("Starting localstack at", composePath);
  await upOne("localstack", { cwd: composePath });
}

async function runTests() {
  // run the npm test command
  console.log("Running tests");
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "test:integration"], {
      stdio: "inherit", // This ensures the output is printed directly to the console
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`Test run exited with code: ${code}`);
        resolve(null);
      } else {
        reject(new Error(`Test run exited with code: ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function runScript() {
  await startLocalstack();
  console.log("Localstack started successfully");
  await runTests();
}

runScript()
  .then(() => {
    console.log("Tests ran successfully");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    // close the localstack service
    console.log("Stopping localstack");
    upOne("localstack", { cwd: composePath, commandOptions: ["down"] });
    process.exit(0);
  });

// run from backend with `npm run script scripts/run-integration-tests.ts`
