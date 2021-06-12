# Serverless S3 Bucket Helper

This plugin set settings on all S3 buckets. These are settings we want everywhere.

Currently, it enables versioning.

## Usage

```
...

plugins:
  - serverless-s3-bucket-helper

...

```

## Background

This plugin has two hooks:

- package:createDeploymentArtifacts: This hook sets versioning on the sls deployment bucket.
- package:compileEvents: This hook sets versioning on all other buckets.
