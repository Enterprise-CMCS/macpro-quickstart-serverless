# The database Service

This service is a DynamoDB service with two (2) database tables, AmendmentsTable and AmendmentsAtomicCounterTable.
The names of each database table are constructed from the stage parameter:
-- <stage>-amendments
-- <stage>-amendments-atomic-counter

The app-api service references these tables.
The stream-functions service requires that DynamoDB Streams is enabled for AmendmentsTable.

The reference for AWS resources referenced in serverless.yml is [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html).

## Service-Specific Configuration Parameters

The database service has no configuration parameters.
