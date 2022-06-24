# proxy-api

The proxy-api service is a REST API with the following endpoints and methods:

1. /proxyFunc:
    - POST: forwards the incoming request to the app-api endpoint configured in the SSM parameter `.../prince/api`.

This service provides a proxy for an app-api endpoint. The proxy service such that it receives an incoming request, extracts the request body, if any, and creates a POST request, with the body, to the proxied endpoint. The proxied endpoint is configurable and stored in SSM parameter store.

The reference docs for AWS resources referenced in serverless.yml are here:
- [functions](https://www.serverless.com/framework/docs/providers/aws/guide/functions)

| Parameter              | Required? | Accepts a default? | Accepts a branch override? | Purpose                                                                                                                |
| ---------------------- | :-------: | :----------------: | :------------------------: | ---------------------------------------------------------------------------------------------------------------------- |
| .../warmup/schedule    |     N     |         Y          |             Y              | A set schedule for warming up the lambda functions.                                                             |
| .../warmup/concurrency |     N     |         Y          |             Y              | The number of concurrent lambdas to invoke on warmup. |
| .../prince/api         |     N     |         Y          |             Y              | The proxied endpoint.                                                                                                   |
