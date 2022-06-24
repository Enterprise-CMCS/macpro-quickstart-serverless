# Terminology

The term `service` refers to the infrastructure resources and application code defined in a serverless.yml file. The QuickStart app is composed of multiple serverless.yml files; each one is in its own folder, representing a named serice. Information on the syntax of a serverless.yml file, for use with AWS, is [here](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml).

The terms `branch` and `stage` are equivalent. When a user pushes code to a git `branch`, the QuickStart deploys multiple services by invoking `serverless deploy --stage <branch>` for each service being deployed. A `branch` name must be less than 27 characters.

For each service, the QuickStart generates a CloudFormation template that AWS deploys to build a [CloudFormation stack](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html). For a given stage, the names of each CloudFormation stack follow the pattern `<service-name>-<stage>`.

The term `environment` is a generic term that implies `branch` or `stage` or the collection of `CloudFormation stacks` that comprise the `stage`.

# Service Configuration

The QuickStart uses [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), often referred to as SSM, to inject environment-specific, project-specific, and/or sensitive information into a deployment.
SSM is an AWS service that allows users to store (optionally) encrypted strings in a directory-like hierarchy. For example, "/my/first/ssm/param" is a valid path for a parameter. Access to SSM and individual parameters are granted via AWS IAM.

An example of environment-specific information is the id of a VPC into which we want to deploy. This VPC id should not be checked into git, as it may vary from environment to environment, so we would use SSM to store the id information and use the [Serverless Framework's SSM lookup capability](https://www.serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store) to fetch the information at deploy time.

This project implements a pattern for specifying defaults for variables, while allowing for overrides. The pattern also supports hard-coded values for parameters that don't have a default value. The order of precedence is left-to-right in the list of parameters. The pattern assigns a branch-specific value to a variable, if present; otherwise, it assigns a default value, if present; otherwise, it assigns a hard-coded value. Here is an example of applying the pattern to the sesSourceEmailAddress variable:

```
sesSourceEmailAddress: ${ssm:/configuration/${self:custom.stage}/sesSourceEmailAddress, ssm:/configuration/default/sesSourceEmailAddress, ""}
```

The above syntax means "look for the SSM parameter at `/configuration/<stage>/sesSourceEmailAddress`; if there isn't one, then continue down the list, until a parameter is found. With this logic, we can specify a default value for this variable that applies to all environments in a given account, but if we wish to set a different value for a specific environment (i.e., a branch), we can create a parameter at the branch-specific path and it takes precedence. For parameters that do not accept a default value, we can use a hard-coded value.

The `...` notation represents the base path common to all parameters. The base path is either `/configuration/default` (for a default value) or `/configuration/<branch>` (for a branch-specific value).

# Service Configuration Parameters Common to All Services

All services are configured to run:

- in the `us-east-1` region
- using nodejs14.x runtime

The region and runtime are configured for each service and are not stored in SSM.

The following configuration parameters are common to all services deployed by the QuickStart and stored in SSM. Service-specific configuration parameters are defined in each service-specific README.

| Parameter                         | Required? | Accepts a default? | Accepts a branch override? | Purpose                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | :-------: | :----------------: | :------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .../iam/path                      |     N     |         Y          |             Y              | Specifies the [IAM Path](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-friendly-names) at which all IAM objects should be created. The default value is "/". The path variable in IAM is used for grouping related users and groups in a unique namespace, usually for organizational purposes.                                                                  |
| .../iam/permissionsBoundaryPolicy |     N     |         Y          |             Y              | Specifies the [IAM Permissions Boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) that should be attached to all IAM objects. A permissions boundary is an advanced feature for using a managed policy to set the maximum permissions that an identity-based policy can grant to an IAM entity. If set, this parameter should contain the full ARN to the policy. |
