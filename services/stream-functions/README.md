# The stream-functions Service

This service sends a notification email to the person who submitted the change and to a list of reviewers who can review the change (after the fact). The change is completed after it is submitted. The changes that trigger a notification email are:

- an item was inserted
- an item was modified
- an item was deleted

The `serverless.com` reference docs for the `functions` section in serverless.yml:

- [functions](https://www.serverless.com/framework/docs/providers/aws/guide/functions)

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service (see below for more background and context).
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../sesSourceEmailAddress | N | Y | Y | The email address the application uses in the `from:` field. This email address must be verified in SES.|
| .../reviewerEmailAddress | N | Y | Y | The email address(es) the application uses in the `to:` field. The recipients review the submission.|
