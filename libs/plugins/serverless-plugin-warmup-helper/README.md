# Serverless Warmup Plugin Helper

This plugin wraps the [severless-plugin-warmup](https://www.npmjs.com/package/serverless-plugin-warmup) to make it idempotent.

## Usage

```
...

plugins:
  - serverless-plugin-warmup-helper

...
```

You may configure the plugin settings exactly as you would for the serverUless-plugin-warmup.

## Background

There exists a small idempotency issue caused by the inclusion of a timestamp in the warmup function's source code.  I've opened a PR against serverless-plugin-warmup in the hopes to fix it upstream.  See https://github.com/juanjoDiaz/serverless-plugin-warmup/pull/271  If/when that PR is accepted, this plugin can be removed, and the serverless-plugin-warmup can be used directly.

Documentation here is admittedly light, as I expect this wrapper is a stop gap.
