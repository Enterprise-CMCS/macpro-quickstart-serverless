# macpro-quickstart-serverless ![Build](https://github.com/CMSgov/macpro-quickstart-serverless/workflows/Build/badge.svg?branch=master)[![latest release](https://img.shields.io/github/release/cmsgov/macpro-quickstart-serverless.svg)](https://github.com/cmsgov/macpro-quickstart-serverless/releases/latest)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCMSgov%2Fmacpro-quickstart-serverless.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCMSgov%2Fmacpro-quickstart-serverless?ref=badge_shield)

A serverless form submission application built and deployed to AWS with the Serverless Application Framework.


## Architecture

![Architecture Diagram](./.images/architecture.png?raw=true)

## Usage

See master build [here](https://github.com/CMSgov/macpro-quickstart-serverless/actions?query=branch%3Amaster)

This application is built and deployed via GitHub Actions.

CircleCI support is included, but its use is discouraged unless you cannot use GitHub Actions.

Want to deploy from your Mac?
- Create an AWS account
- Install/configure the AWS CLI
- npm install -g severless
- sh deploy.sh

Building the app locally
- todo

Running tests locally
- todo

## Requirements

NodeJS and Serverless - Get help installing both at the [Serverless Getting Started page](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)

AWS Account:  You'll need an AWS account with appropriate IAM permissions (admin recommended) to build this app in Amazon.

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


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCMSgov%2Fmacpro-quickstart-serverless.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCMSgov%2Fmacpro-quickstart-serverless?ref=badge_large)

### Contributors

This project made possible by the [Serverless Stack](https://serverless-stack.com/) and its authors/contributors.  The extremely detailed tutorial, code examples, and serverless pattern is where this project started.  I can't recommend this resource enough.

| [![Mike Dial][dial_avatar]][dial_homepage]<br/>[Mike Dial][dial_homepage] |
|---|

  [dial_homepage]: https://github.com/mdial89f
  [dial_avatar]: https://avatars.githubusercontent.com/mdial89f?size=150