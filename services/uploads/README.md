# The uploads Service

This service runs two (2) Lambda functions. They use the open source tool [ClamAV](https://clamav.net) to get the latest virus defintion files and to scan new/updated files.

The avDownloadDefinitions lambda:

- downloads the latest virus definition files and stores them on the file system (`updateAVDefinitonsWithFreshclam()`)
- removes all virus definition files from CLAMAV_BUCKET_NAME; uploads the lastest files from the file system (`uploadAVDefinitions()`) to the S3 bucket CLAMAV_BUCKET_NAME

The avScan lambda:

- triggers by a change (file upload/update) to the User Attachments S3 bucket
- scans the uploaded/updated file using the virus definition files in CLAMAV_BUCKET_NAME
- tags the file with scanned status

The reference docs for AWS resources referenced in serverless.yml are here:

- [S3](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_S3.html)
- [Lambda](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Lambda.html)

## Configuration - AWS Systems Manager Parameter Store (SSM)

The following values are used to configure the deployment of this service.
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../warmup/schedule | N | Y | Y | This is a set schedule for warming up the lambda function. |
| .../warmup/concurrency | N | Y | Y | The number of lambda functions to invoke on warmup. The higher this number the warm lambda containers are ready to go. |
