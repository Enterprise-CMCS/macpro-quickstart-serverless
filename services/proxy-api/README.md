# The proxy-api Service

The proxy-api service is a REST API with the following endpoints and methods:

1. /prince/api
   -- POST: sends a request to an app-api endpoint

This endpoint proxies an incoming request to another API. The QuickStart implements the proxy service such that it receives an incoming request, extracts the request body, if any, and creates a POST request, with the body, to the proxied endpoint. The proxied endpoint is configurable and stored in SSM parameter store.

| Parameter              | Required? | Accepts a default? | Accepts a branch override? | Purpose                                                                                                                |
| ---------------------- | :-------: | :----------------: | :------------------------: | ---------------------------------------------------------------------------------------------------------------------- |
| .../warmup/schedule    |     N     |         Y          |             Y              | This is a set schedule for warming up the lambda function.                                                             |
| .../warmup/concurrency |     N     |         Y          |             Y              | The number of lambda functions to invoke on warmup. The higher this number the warm lambda containers are ready to go. |
| .../prince/api         |     Y     |         Y          |             Y              | The proxied endpoint                                                                                                   |
