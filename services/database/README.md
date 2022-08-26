# database

#test
This service is a DynamoDB service with two database tables.
The names of each database table are constructed from the stage parameter:

- `<stage>`-amendments: stores all the information submitted in the form on the Home page, as well as user and record metadata
- `<stage>`-amendments-atomic-counter: for each territory, it stores the number of records in the amendments table for that territory

The app-api service references these tables.
The stream-functions service depends on [DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) from the amendments table.

The reference docs for AWS resources referenced in `serverless.yml` are:

- [DynamoDB](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html).

## Service-Specific Configuration Parameters

The database service has no configuration parameters.
