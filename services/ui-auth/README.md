# ui-auth

This service uses AWS Cognito to authenticate users that sign-in to the QuickStart. Details about how the QuickStart configures the AWS Cognito service are [here](https://confluenceent.cms.gov/x/uKufEw). Changes to how the QuickStart configures Cognito must be copied to [the confluence doc](https://confluenceent.cms.gov/x/uKufEw). _The details are important for QuickStart teams to review. Teams should verify the configuration is correct and secure and appropriate for their application_.

This service:

- [creates one Cognito user pool and configures it as an identity provider](https://confluenceent.cms.gov/x/uKufEw#QuickStartService:uiauth-CognitoUserPool) (IdP) 
  - [creates users in the user pool, if enabled](https://confluenceent.cms.gov/x/uKufEw#QuickStartService:uiauth-BootstrappedUsers)
  - allows new users to sign-up for an account
  - [configures the sign-in experience](https://confluenceent.cms.gov/x/uKufEw#QuickStartService:uiauth-Sign-InExperience:HostedUI)
- [integrates the QuickStart app with the Cognito user pool](https://confluenceent.cms.gov/x/uKufEw#QuickStartService:uiauth-CognitoUserPoolClient) 
- [creates one Cognito identity pool](https://confluenceent.cms.gov/x/uKufEw#QuickStartService:uiauth-CognitoIdentityPool), configured with the Cognito user pool as its IdP
  - registers each authenticated user in the user pool with the identity pool; in the context of the identity pool, a user is called a `federated identity` or simply an `identity`
  - associates the identity pool with an AWS IAM role
  - each authenticated ` identity` can assume this role
  - the role has permissions to perform:
      - all actions on the API Gateway
      - all actions on the `private` folder in the S3 attachments bucket,
      - `"cognito-identity:*"`, `"cognito-sync:*"`, and `"mobileanalytics:PutEvents"` actions
- [supports `Okta federated users`](https://confluenceent.cms.gov/x/uKufEw#QuickStartService:uiauth-Sign-InExperience:Okta); i.e., users that use Okta (SAML) as their IdP

The reference docs for AWS resources referenced in serverless.yml are:

- [Cognito](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Cognito.html)
- [IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_IAM.html)
- [functions](https://www.serverless.com/framework/docs/providers/aws/guide/functions)

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service.
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../sesSourceEmailAddress | N | Y | Y | The email address from which the application sends email. This email address must be verified in AWS SES.|
| .../okta_metadata_url | N | N | Y | The SAML Metadata URL for Okta, provided by the Okta team.|
| .../cognito/bootstrapUsers/enabled | N | N | Y | Enables the creation of bootstrapped users. This is useful for testing. Should not be used in production.|
| .../cognito/bootstrapUsers/password | N | N | Y | Sets the password used by all bootstrapped users. The password does not expire. Users are defined in `libs/users.json`.|
