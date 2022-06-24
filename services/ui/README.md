# ui

This service creates resources used to resolve the website domain name and allow/deny traffic to the site. These resources include:

- DNS services (optional)
- AWS Certificate Manager (optional)
- Web Application Firewall Access Control List (ACL)
- CloudFront endpoint

The reference docs for AWS resources referenced in `serverless.yml` are listed below:

- [S3](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_S3.html)
- [WAFv2](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_WAFv2.html)
- [CloudFront](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_CloudFront.html)
- [Route53](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Route53.html)
- [Kinesis Firehose](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_KinesisFirehose.html)
- [AWS IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_IAM.html)

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service (see below for more background and context).
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../route53HostedZoneId | N | Y | Y | This is the Id of the Amazon Route53 hosted zone.|
| .../route53DomainName | N | N | Y | Route53 domain name for the site.|
| .../cloudfrontCertificateArn | N | Y | Y | The ARN for the CloudFront distribution certificate.|
| .../cloudfrontDomainName | N | N | Y | The domain name for the CloudFront distribution.|
| /{stage}/ui/application_endpoint | Y | N | Y | The URL of the CloudFront endpoint.|

To create a DNS "A" Record, set the `route53HostedZoneId` and `route53DomainName` parameters.
To assign a certificate to the CloudFront application endpoint, create the certificate using AWS Certificate Manager. Then set the `cloudfrontCertificateArn` and `cloudfrontDomainName` parameters.
