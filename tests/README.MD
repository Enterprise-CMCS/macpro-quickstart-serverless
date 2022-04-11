# Cypress Testing

[Cypress](https://www.cypress.io/features) is an open source testing tool.

## Getting Started

1. The `scripts` section defines 2 jobs:
   - `npm run test`
     - runs two parallel processes:
       1. `npm start`, which is a wrapper to `./dev local`, and runs the local application
       1. `npm run cypress`, which opens cypress using chrome against the local instance
   - `npm run test:ci`
     - to be run in pipelines/actions
     - runs cypress headless against the branch-specific instance of the application (eg. )

## Configuration

`cypress.json` may use any of [these](https://docs.cypress.io/guides/references/configuration#Global) config options.

## Cypress CLI

The [cypress cli](https://docs.cypress.io/guides/guides/command-line) comes with a number of options/flags/behaviors built into it, which allow it to target browsers, configure parallelization, and so on.
