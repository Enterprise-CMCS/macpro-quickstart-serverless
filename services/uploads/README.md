# uploads

This service uses the open source tool [ClamAV](https://clamav.net) to get the latest virus definition files and to scan new/updated files.

The service:

- downloads the latest virus definition files and uploads them to the S3 bucket CLAMAV_BUCKET_NAME
- scans all files that are uploaded/updated to the User Attachments bucket
- tags each scanned file with scanned status

The reference docs for AWS resources referenced in serverless.yml are here:

- [S3](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_S3.html)
- [Lambda](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Lambda.html)
- [functions](https://www.serverless.com/framework/docs/providers/aws/guide/functions)

## Configuration - AWS Systems Manager Parameter Store (SSM)

The following values are used to configure the deployment of this service.
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../warmup/schedule | N | Y | Y | A fixed schedule for warming up the lambda functions. |
| .../warmup/concurrency | N | Y | Y | The number of concurrent lambdas to invoke on warmup. |
