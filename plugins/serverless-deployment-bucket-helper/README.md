# Serverless Deployment Bucket Helper Plugin

This plugin enables versioning on serverless created deployment buckets.

## Usage

```
...

plugins:
  - serverless-deployment-bucket-helper

...

```

All provider level configuration for the deployment bucket will continue to operate as documented by Serverless. Enabling this plugin will simply turn on versioning.

## Background

This plugin was made to enable versioning on serverless created deployment buckets.

There exists plugins, namely [serverless-deployment-bucket](https://www.serverless.com/plugins/serverless-deployment-bucket), to enable versioning and more. However, there are a few drawbacks when using them. I'm going to list the things we've noticed, and what led us to make this plugin:

- When using serverless-deployment-bucket, the options set in custom.deploymentBucket only take effect when the provider.deploymentBucket.name is set. This logic can be seen [here](serverless-deployment-bucket). This means we (the deployer), as opposed to serverless, must generate a globally unique S3 bucket name. This isn't too problematic, but isn't ideal.
- Once provider.deploymentBucket.name is set, it can be difficult to modify. See [this issue](https://seed.run/docs/serverless-errors/the-serverless-deployment-bucket-does-not-exist.html) discussed on seed.run.
- When serverless, as opposed to the deployer, generates the s3 bucket name, it will automatically truncate the name at 63 characters, s3's limit. This is great functionality... since serverless will ensure the deployment buckets it creates are globally unique, we're not concerned with the truncation; in fact, it's preferred. Depending on the naming convention a user might implement, the s3 bucket name length can be reached. We had this issue.
