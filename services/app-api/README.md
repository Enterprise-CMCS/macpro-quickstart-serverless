# app-api

The app-api service is a REST API with the following endpoints and methods:

1. /amendments
   - GET: get all amendments
   - POST: create an amendment
2. /amendments/{id}
   - GET: get an amendment
   - PUT: update an amendment
   - DELETE: delete an amendment

The app-api service endpoints reference DynamoDB tables created by the database service.

The reference docs for AWS resources referenced in serverless.yml are here:

- [DynamoDB](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html)
- [API Gateway Response](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html)
- [WAFv2 WebACL](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html)
- [functions](https://www.serverless.com/framework/docs/providers/aws/guide/functions)

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service.
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../warmup/schedule | N | Y | Y | A set schedule for warming up the lambda functions.|
| .../warmup/concurrency | N | Y | Y | The number of concurrent lambdas to invoke on warmup.|
