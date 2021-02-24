# macpro-quickstart-serverless ![Build](https://github.com/CMSgov/macpro-quickstart-serverless/workflows/Build/badge.svg?branch=master)[![latest release](https://img.shields.io/github/release/cmsgov/macpro-quickstart-serverless.svg)](https://github.com/cmsgov/macpro-quickstart-serverless/releases/latest)

A serverless form submission application built and deployed to AWS with the Serverless Application Framework.

## Architecture

![Architecture Diagram](./.images/architecture.png?raw=true)

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

NodeJS and Serverless - Get help installing both at the [Serverless Getting Started page](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)

AWS Account: You'll need an AWS account with appropriate IAM permissions (admin recommended) to build this app in Amazon.

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
