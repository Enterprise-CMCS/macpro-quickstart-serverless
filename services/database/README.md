# database

## Configuration - AWS Systems Manager Parameter Store (SSM)

The following values are used to configure the deployment of this service (see below for more background and context).
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../dynamodbBackup/enabled | Y | Y | Y | When set to true, enables Point in time recovery (backup) on dynamodb. the default value is false. (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html)         
