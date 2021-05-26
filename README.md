# macpro-quickstart-serverless ![Build](https://github.com/CMSgov/macpro-quickstart-serverless/workflows/Deploy/badge.svg?branch=master) [![latest release](https://img.shields.io/github/release/cmsgov/macpro-quickstart-serverless.svg)](https://github.com/cmsgov/macpro-quickstart-serverless/releases/latest) [![Maintainability](https://api.codeclimate.com/v1/badges/1449ad929006f559756b/maintainability)](https://codeclimate.com/github/CMSgov/macpro-quickstart-serverless/maintainability) [![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/) [![CodeQL](https://github.com/CMSgov/macpro-quickstart-serverless/actions/workflows/codeql-analysis.yml/badge.svg?branch=codeql)](https://github.com/CMSgov/macpro-quickstart-serverless/actions/workflows/codeql-analysis.yml) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Test Coverage](https://api.codeclimate.com/v1/badges/1449ad929006f559756b/test_coverage)](https://codeclimate.com/github/CMSgov/macpro-quickstart-serverless/test_coverage)

A serverless form submission application built and deployed to AWS with the Serverless Application Framework.

## Release

Our product is promoted through branches. Master is merged to val to affect a master release, and val is merged to production to affect a production release. Please use the buttons below to promote/release code to higher environments.<br />

| branch     | status                                                                                                             | release                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| master     | ![master](https://github.com/CMSgov/macpro-quickstart-serverless/workflows/Deploy/badge.svg?branch=master)         | [![release to master](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/CMSgov/macpro-quickstart-serverless/compare?quick_pull=1)                                                                                                   |
| val        | ![val](https://github.com/CMSgov/macpro-quickstart-serverless/workflows/Deploy/badge.svg?branch=val)               | [![release to val](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/CMSgov/macpro-quickstart-serverless/compare/val...master?quick_pull=1&template=PULL_REQUEST_TEMPLATE.val.md&title=Release%20to%20Val)                          |
| production | ![production](https://github.com/CMSgov/macpro-quickstart-serverless/workflows/Deploy/badge.svg?branch=production) | [![release to production](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/CMSgov/macpro-quickstart-serverless/compare/production...val?quick_pull=1&template=PULL_REQUEST_TEMPLATE.production.md&title=Release%20to%20Production) |

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

## Local Dev

Run all the services locally with the command `./dev local`

See the Requirements section if the command asks for any prerequisites you don't have installed.

Local dev is configured in typescript project in `./src`. The entrypoint is `./src/dev.ts`, it manages running the moving pieces locally: the API, the database, the filestore, and the frontend.

Local dev is built around the Serverless plugin [`serverless-offline`](https://github.com/dherault/serverless-offline). `serverless-offline` runs an API gateway locally configured by `./services/app-api/serverless.yml` and hot reloads your lambdas on every save. The plugins [`serverless-dynamodb-local`](https://github.com/99x/serverless-dynamodb-local) and [`serverless-s3-local`](https://github.com/ar90n/serverless-s3-local) stand up the local db and local s3 in a similar fashion.

When run locally, auth bypasses Cognito. The frontend mimics login in local storage with a mock user and sends an id in the `cognito-identity-id` header on every request. `serverless-offline` expects that and sets it as the cognitoId in the requestContext for your lambdas, just like Cognito would in AWS.

## Usage

See master build [here](https://github.com/CMSgov/macpro-quickstart-serverless/actions?query=branch%3Amaster)

This application is built and deployed via GitHub Actions.

Want to deploy from your Mac?

- Create an AWS account
- Install/configure the AWS CLI
- npm install -g severless
- brew install yarn
- sh deploy.sh

Building the app locally

- todo

Running tests locally

- todo

## Requirements

Node - we enforce using a specific version of node, specified in the file `.nvmrc`. This version matches the Lambda runtime. We recommend managing node versions using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating).

Serverless - Get help installing it here: [Serverless Getting Started page](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)

Yarn - in order to install dependencies, you need to [install yarn](https://classic.yarnpkg.com/en/docs/install/).

AWS Account: You'll need an AWS account with appropriate IAM permissions (admin recommended) to deploy this app in Amazon.

If you are on a Mac, you should be able to install all the dependencies like so:

```
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

# select the version specified in .nvmrc
nvm install
nvm use

# install yarn
brew install yarn

# run dev
./dev local
```

## Dependencies

None.

## Examples

None.

## Contributing / To-Do

See current open [issues](https://github.com/mdial89f/quickstart-serverless/issues) or check out the [project board](https://github.com/mdial89f/quickstart-serverless/projects/1)

Please feel free to open new issues for defects or enhancements.

To contribute:

- Fork this repository
- Make changes in your fork
- Open a pull request targetting this repository

Pull requests are being accepted.

## License

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE.md) for full details.

```text
As a work of the United States Government, this project is
in the public domain within the United States.

Additionally, we waive copyright and related rights in the
work worldwide through the CC0 1.0 Universal public domain dedication.
```

## Slack channel

To enable slack integration, set a value for SLACK_WEBHOOK_URL in github actions secret.

To set the SLACK_WEBHOOK_URL:

- Go to https://api.slack.com/apps
- Create new app : fill in the information
- Add features and funtionality----Incoming webhooks--- activative incoming webooks--- Add new webhook to workspace.
- copy new webhook url and set it as SLACK_WEBHOOK_URL in github actions secret.

Please join the macpro-quickstart-serverless slack channel to get all build status and also contribute to any ongoing discussions.
Join here: https://join.slack.com/t/macproquickst-ugp3045/shared_invite/zt-mdxpbtkk-SrLRi_yzJrXX3uYgvrbjlg

### Contributors

This project made possible by the [Serverless Stack](https://serverless-stack.com/) and its authors/contributors. The extremely detailed tutorial, code examples, and serverless pattern is where this project started. I can't recommend this resource enough.

| [![Mike Dial][dial_avatar]][dial_homepage]<br/>[Mike Dial][dial_homepage] | [![Seth Sacher][sacher_avatar]][sacher_homepage]<br/>[Seth Sacher][sacher_homepage] |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |

[dial_homepage]: https://github.com/mdial89f
[dial_avatar]: https://avatars.githubusercontent.com/mdial89f?size=150
[sacher_homepage]: https://github.com/sethsacher
[sacher_avatar]: https://avatars.githubusercontent.com/sethsacher?size=150
