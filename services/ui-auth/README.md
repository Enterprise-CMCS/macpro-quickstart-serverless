# The ui-auth Service

This service:

- creates one (1) Cognito user pool and configures it as an identity provider (IdP) [CloudFormation User Pool Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html)
  -- creates users in the user pool (referred to as "bootstrapped" or "native" users)
  -- creates a single password, shared by all bootstrapped users, to log in to the app
  -- allows new users to sign-up for an account
  -- [configure sign-up experience](https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html?icmpid=docs_cognito_console_help_panel)
- integrates the QuickStart app with the Cognito user pool
  -- creates an `app client` for the user pool (also referred to as `user pool client`)
  -- the `app client` provides a login UI and performs OAuth2 authentication (authorization code grant flow) using Cognito's authorization server
- creates one (1) Cognito identity pool, configured with the Cognito user pool as its IdP
  -- adds each authenticated user pool user to the identity pool; in the context of the identity pool, these users are `federated identities`
  -- associates the identity pool with an AWS IAM role
  -- each authenticated `AWS federated identity` can assume this role
  -- the role allows each authenticated `AWS federated identity` to perform all actions on:
  -- the API Gateway
  -- the `private` folder in the S3 attachments bucket
  -- all `"cognito-identity:*"` resources
- supports `Okta federated users`; i.e., users that use Okta (SAML) as their IdP
  -- for this use case, the [Cognito acts as a bridge to Okta](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-federation.html), with Okta as the IdP
  -- maps user pool attributes to SAML attributes
  -- references the SSM parameter okta_metadata_url
  -- manual work: coordinate with the Okta team to register the QuickStart app with Okta
  -- manual work: get the XML metadata document output by Okta; upload it to the Cognito user pool

The reference docs for AWS resources referenced in serverless.yml are:

- [Cognito](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Cognito.html)
  -- [user pool lambda triggers can be added to customize authentication actions](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html?icmpid=docs_cognito_console_help_panel)
- [IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_IAM.html)

## Cognito User Pool

The QuickStart creates 1 user pool, which represents a collection, or pool, of users. The sign-in experience is configured to use the AWS service, referred to as `Hosted UI`, that provides a login UI and OAuth2 authorization server.

To enable the sign-in experience to use the Okta IdP, create a Jira ticket in the [CMS OIT IDM project](https://jiraent.cms.gov/secure/RapidBoard.jspa?rapidView=4493&projectKey=IDM). Provide:

- application name
- region (us-east-1)
- integration type (SAML)
- for more information, see [notes](https://confluenceent.cms.gov/x/7At4Eg) on an Okta integration POC

When a user is authenticated by Okta, the user pool initially acts as a bridge between the QuickStart app and Okta. Okta authenticates the user and returns a SAML assertion to Cognito. Cognito reads the claims about the user in the assertion and maps the claims to a new user profile in the user pool directory. After Cognito creates a profile for the user (referred to as a `federated user`), the user pool is the effective IdP for the user. The next time the user signs in, the user is authenticated by the Cognito user pool.

### How to Create Bootstrapped Users in the Pool

Bootstrapped users are native users, configured and deployed by Serverless.
To add native users to the identity pool:

- set the SSM parameter `.../cognito/bootstrapUsers/enabled` to `true`
- set the SSM password parameter `.../cognito/bootstrapUsers/password` to a value that meets the password policy
  -- password minimum length = 8
  -- must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character: (^ $ \* . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | \_ ~ ` + =)

Use one of these users and the password to log into the app.

### Cognito User Pool Client

The Cognito user pool client, also referred to as `app client`, is an AWS abstraction that:

- allows a developer to register the app with Cognito,
- implements a login UI for users of the app, and
- implements an OAuth2 authorization server to provide tokens to the app

The `app client`, after the user authenticates to the app, provides three (3) JSON Web Tokens (JWTs) to the app: an OIDC ID token, an OAuth2 access token, and an OAuth2 refresh token. The ID token contains claims about the user (e.g., username, email, email_verified); the access token contains claims about the `app client` (e.g., client_id, scopes). The app uses the JWTs to authorize a logged-in user to access resources. The refresh token, an encrypted JWT, is used to get new ID and access tokens, without requiring the user to logout and login again. The `app client` is configured for multiple functions:

- App information (for registering the app with the user pool):
  -- App client name
  -- Client ID (automatically generated by AWS)
  -- Authentication flows: ADMIN_NO_SRP_AUTH `????` (new name: ALLOW_ADMIN_USER_PASSWORD_AUTH) (set this value to ExplicitAuthFlow when you call CreateUserPoolClient or UpdateUserPoolClient)
- OAuth2 Authorization Server Configuration (provides ID, access, and refresh tokens to the app)
  -- callback URLs
  -- Refresh token expiration: 30 days
  -- Access token expiration: 1 hour
  -- ID token expiration: 1 hour
  -- Advanced authentication settings: enable token revocation
  -- OAuth grant types (Authorization code grant)
  -- OIDC scopes (email, openid, aws.cognito.signin.user.admin)
- Hosted UI (the login UI):
  -- domain name

## Cognito Identity Pool

An identity pool is associated with a user pool. AWS creates an identity (referred to as a `federated identity`) in the identity pool for each verified user in the user pool.
A `federated identity` can assume an IAM role and get temporary AWS credentials to access AWS resources.

After a user enters their username and password into the login UI and hits "Submit", the user is authenticated by the Cognito. If the user is successfully authenticated, the user receives three (3) tokens: ID, access, and refresh. The QuickStart service uses these tokens to get AWS credentials and user attributes from Cognito.

- send request to identity pool to get Identity Id
  -- POST to https://cognito-identity.us-east-1.amazonaws.com/ (Payload: IdentityPoolId, IdP, ID token)
  Response: Identity Id
- send request to identity pool to get AWS credentials for the identity id
  -- POST to https://cognito-identity.us-east-1.amazonaws.com/ (Payload: IdentityId, IdP, ID token)
  Response: AWS credentials
- send request to user pool to get user attributes
  -- POST to https://cognito-idp.us-east-1.amazonaws.com/ (Payload: AccessToken)
  Response: user attributes

The app now has AWS credentials and user attributes, stored by the browser.

## AWS Cognito with AWS Amplify

TODO

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service (see below for more background and context).
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../sesSourceEmailAddress | N | Y | Y | The email addressfrom which the apllication sends the email. This email address must be verified in SES.|
| .../okta_metadata_url | N | N | Y | The SAML Metadata URL for Okta, retrieved from Okta's Admin console, from the app.|
| .../cognito/bootstrapUsers/enabled | N | Y | Y | Enables the creation of bootstrapped users. This is useful for testing.|
| .../cognito/bootstrapUsers/password | N | Y | Y | Sets the single password used by all bootstrapped users. Users are defined in `libs/users.json`.|
