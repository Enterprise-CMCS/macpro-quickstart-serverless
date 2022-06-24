# Cypress Testing

[Cypress](https://www.cypress.io/features) is an open source testing tool.

## Setup

Run `yarn install` in this directory to install dependencies.

## Running tests

The `scripts` section of `package.json` defines the following scripts:

- `start`

  - a wrapper to `scripts/dev.sh local`, which runs the application locally. Note that the `local` option for this script requires valid AWS credentials set per the [Serverless Framework docs](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

- `test`

  - runs two parallel processes:
    1. the `start` script
    2. `cypress run`, which opens Cypress using Chrome against the local app. The exit code of this process determines the exit code of the script.

- `cypress`
  - opens the Cypress App

## Configuration

`cypress.json` may use any of [these](https://docs.cypress.io/guides/references/configuration#Global) config options.

## Cypress CLI

The [cypress cli](https://docs.cypress.io/guides/guides/command-line) comes with a number of options/flags/behaviors built into it, which allow it to target browsers, configure parallelization, and so on.
