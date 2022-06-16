# The app-api Service

The app-api service is a REST API with the following endpoints and methods:

1. /amendments
   -- GET: list items in a table
   -- POST: create an item and insert into a table
2. /amendments/{id}
   -- GET: get the amendment id
   -- PUT: update the amendment id
   -- DELETE: delete the amendment id

The app-api service depends on the database service. The app-api table resources reference DynamoDB database tables.

The reference docs for AWS resources referenced in serverless.yml are here:

- [DynamoDB](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html).

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service.
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../warmup/schedule | N | Y | Y | This is a set schedule for warming up the lambda function.|
| .../warmup/concurrency | N | Y | Y | The number of lambda functions to invoke on warmup. The higher this number the warm lambda containers are ready to go.|
