import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";

// load .env
dotenv.config();

// run_db_locally runs the local db
async function run_db_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "db yarn",
    ["yarn", "install"],
    "services/database"
  );
  await runner.run_command_and_output(
    "db svls",
    ["serverless", "dynamodb", "install"],
    "services/database"
  );
  runner.run_command_and_output(
    "db",
    ["serverless", "--stage", "local", "dynamodb", "start", "--migrate"],
    "services/database"
  );
}

// run_api_locally uses the serverless-offline plugin to run the api lambdas locally
async function run_api_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "api deps",
    ["yarn", "install"],
    "services/app-api"
  );
  runner.run_command_and_output(
    "api",
    [
      "serverless",
      "--stage",
      "local",
      "--region",
      "us-east-1",
      "offline",
      "--httpPort",
      "3030",
      "start",
    ],
    "services/app-api"
  );
}

// run_s3_locally runs s3 locally
async function run_s3_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "s3 yarn",
    ["yarn", "install"],
    "services/uploads"
  );
  runner.run_command_and_output(
    "s3",
    ["serverless", "--stage", "local", "s3", "start"],
    "services/uploads"
  );
}

// run_fe_locally runs the frontend and its dependencies locally
async function run_fe_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "ui deps",
    ["yarn", "install"],
    "services/ui-src"
  );
  await runner.run_command_and_output(
    "ui conf",
    ["./env.sh", "local"],
    "services/ui-src"
  );

  runner.run_command_and_output("ui", ["npm", "start"], "services/ui-src");
}

// run_all_locally runs all of our services locally
async function run_all_locally() {
  const runner = new LabeledProcessRunner();

  run_db_locally(runner);
  run_s3_locally(runner);
  run_api_locally(runner);
  run_fe_locally(runner);
}

// The command definitons in yargs
// All valid arguments to dev should be enumerated here, this is the entrypoint to the script
yargs(process.argv.slice(2))
  .command("local", "run system locally", {}, () => {
    run_all_locally();
  })
  .command(
    "test",
    "run all tests",
    () => {},
    () => {
      console.log("Testing 1. 2. 3.");
    }
  )
  .demandCommand(1, "").argv; // this prints out the help if you don't call a subcommand
