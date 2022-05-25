# ui

## Configuration - AWS Systems Manager Parameter Store (SSM)

The following values are used to configure the deployment of this service (see below for more background and context).
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../iam/path | N | Y | Y | Specifies the [IAM Path](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-friendly-names) at which all IAM objects should be created. The default value is "/". The path variable in IAM is used for grouping related users and groups in a unique namespace, usually for organizational purposes.|
| .../iam/permissionsBoundaryPolicy | N | Y | Y | Specifies the [IAM Permissions Boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) that should be attached to all IAM objects. A permissions boundary is an advanced feature for using a managed policy to set the maximum permissions that an identity-based policy can grant to an IAM entity. If set, this parmeter should contain the full ARN to the policy.|
| route53HostedZoneId | N | Y | Y | This is the Id of the Amazon route53 hosted zone.|
| cloudfrontCertificateArn | N | Y | Y | The arn for the clodfront distribution certificate.|
| cloudfrontDomainName | N | N | Y | The domain name for the cloudfront distribution.|
| route53DomainName | N | N | Y | Route 53 domain name for the site if applicable.|

This project uses [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), often referred to as simply SSM, to inject environment specific, project specific, and/or sensitive information into the deployment.
In short, SSM is an AWS service that allows users to store (optionally) encrypted strings in a directory like hierarchy. For example, "/my/first/ssm/param" is a valid path for a parameter. Access to this service and even individual paramters is granted via AWS IAM.

An example of environment specific information is the id of a VPC into which we want to deploy. This VPC id should not be checked in to git, as it may vary from environment to environment, so we would use SSM to store the id information and use the [Serverless Framework's SSM lookup capability](https://www.serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store) to fetcn the information at deploy time.

This project has also implemented a pattern for specifying defaults for variables, while allowing for branch (environment specific overrides). That pattern looks like this:

```
sesSourceEmailAddress: ${ssm:/configuration/${self:custom.stage}/sesSourceEmailAddress~true, ssm:/configuration/default/sesSourceEmailAddress~true}
```

The above syntax says "look for an ssm parameter at /configuration/<branch name>/sesSourceEmailAddress; if there isn't one, look for a parameter at /configuration/default/sesSourceEmailAddress". With this logic, we can specify a generic value for this variable that would apply to all environments deployed to a given account, but if we wish to set a different value for a specific environment (branch), we can create a parameter at the branch specific path and it will take precedence.

In the above tabular documentation, you will see columns for "Accepts default?" and "Accepts a branch override?". These columns relate to the above convention of searching for a branch specific override but falling back to a default parameter. It's important to note if a parameter can accept a default or can accept an override, because not all can do both. For example, a parameter used to specify Okta App information cannot be set as a default, because Okta can only support one environment (branch) at a time; so, okta_metadata_url is a good example of a parameter that can only be specified on a branch by branch basis, and never as a default.

In the above documentation, you will also see the Parameter value denoted as ".../iam/path", for example. This notation is meant to represent the core of the parameter's expected path. The "..." prefix is meant to be a placeholder for either "/configuration/default" (in the case of a default value) or "/configuration/myfavoritebranch" (in the case of specifying a branch specific override for the myfavoritebranch branch.
