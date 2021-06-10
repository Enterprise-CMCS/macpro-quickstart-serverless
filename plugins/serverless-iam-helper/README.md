# Serverless IAM Helper Plugin

This plugin intends to help apply IAM Path and PermissionsBoundary properties to hard to reach IAM roles, but conditionally applies to all.

## Usage

```
...

plugins:
  - serverless-iam-helper

...

provider:
  iam:
    role:
      path: /my/custom/path
        permissionsBoundary: arn:aws:iam::000000000000:policy/my/custom-boundary-policy
```

## Background

While the Serverless Framework supports [path/permboundary specification at the provider level](https://www.serverless.com/framework/docs/providers/aws/guide/iam/), that capability seems to only affect roles generated for user defined functions. Some serverless deployments generate roles outside of user defined functions, sometimes in user defined cloudformation and sometimes behind the scenes of certain plugins/functionality, so this plugin helps reach those.  
Scenarios where this should help:

- Roles are sometimes generated outside the scope of user defined functions or cloudformation. For example, enabling API logging with provider.logs.restApi causes several cloudformation resources to be made behind the scenes, one of which is CustomApiGatewayAccountCloudWatchRole. The provider.iam.role.path/permissionsBoundary do not have an affect on this role, so we need to somehow add Path/PermissionsBoundary. This is possible with serverless extensions, but this plugin will handle it simply by being enabled. Note that this scenario is not explicitly handled... scenarios like this, where a role is created outside the scope of user defined functions, are handled globally and consistently.
- This plugin should be a help if you create roles in Cloudformation and are either disinclined to explicitly set Path/PermissionsBoundary or forget to set them. For example, creating a role for Cognito's AuthenticatedRole use can be done in straight CloudFormation. If a user wants to forego conditionally setting Path/PermissionsBoundary and instead let this plugin handle it, that's fine. Similarly, if this plugin is enabled and a user forgets to set Path/PermissionsBoundary on that role, this plugin will set them behind the scenes.
- In addition, there is one specific scenario this plugin was written to solve. When enabling API Logging via provider.logs.restApi, a custom lambda is built behind the scenes. Previously discussed above, that lambda gets a role attached to it, on which this plugin handles the Path/PermBoundary. That's covered above. However, that custom lambda contains logic in its source code to conditionally create an IAM role for API Gateway's use, allowing it to write to Cloudwatch. The creation of this role (the role the custom might create) does not accomodate path and permissions boundary specifications. This plugin resolves this specific situation by creating a role (with path/permboundary support) for the APIGW and passing it to the custom Lambda. By doing this, the custom Lambda does not create the new role, and it's lack of path/permboundary accomodation is no factor. This is a specific scenario covered by this plugin. It's been solved because it was observed. This plugin can be extended to cover more scenarios as they are observed.

Notes on logic:

- This plugin hooks into before:deploy:deploy.
- The provider.iam.role.path/permissionsBoundary configuration drives this plugin. If a value for either or both is set at the provider level, this plugin assumes you need to apply those paths/permissions boundary to all accepting resources.
- When run, all resources of type AWS::IAM::Role are found.
- If provider.iam.role.path is specified, the plugin makes sure the role's Properties.Path is set to provider.iam.role.path.
- If provider.iam.role.permissionsBoundary is specified, the plugin makes sure the role's Properties.PermissionsBoundary is set to provider.iam.role.permissionsBoundary.
- Paths/PermissionsBoundarys already set on resources will be overwritten. So if a user specifies a provider.iam.role.path to /my/path/one, and then in the same serverless.yml creates a role in cloudformation and attempts to manually set that role's path to /my/path/two... the provider config will win. Originally, this plugin had not overwritten, to allow for users to specify different paths/permboundarys in the same serverless.yml. However, some other plugins and workflows generate cloudformation resources with path set to the default, so there's no good way to differentiate between an incorrectly set path and a user's correctly set path (different than provider config). This is seen as an edge case, however. If a user wants to leverage the provider level iam path/permBoundary settings, the assumption is that all roles created in that service will use the provider config. This plugin stands on that assumption, and is deemed fair.
