# ClamAV Antivirus Scanning

Our approach to AV Scanning is adapted from the following:
Article: https://blog.truework.com/2018-07-09-s3-antivirus-lambda-function/
Repo: https://github.com/truework/lambda-s3-antivirus

There are two lambda functions created:
1. Download Definitions - Download the latest virus database on a set interval.
2. AV Scan - Run an antivirus scan (clamscan) on a file when it is uploaded to the target S3 bucket.

The AV Scan lambda function is dependent on the following repo: https://github.com/sethsacher/lambda-clamav-layer

# Incorporating Antivirus scanning

AV Scanning will deploy automatically, scanning every file uploaded to the "attachments" S3 bucket in this quickstart. If you forked this repo, adding these changes should be automatically applied to your implementation. If you are looking to pull only the scanning functionality into a separate repository, grab all the contents of this directory and update the following in serverless.yml:
* avScan function - Update the S3 event to reference your S3 bucket
* AttachmentsBucketPolicy - Update this policy to reference your S3 bucket.