# .sechub

The .sechub (Security Hub) service is triggered by a cron event. The service scans a GitHub repository and

1. gets all active Security Hub findings
    - for findings already associated with an issue: it updates the issue, if necessary
    - for findings without an issue: it creates an issue for the finding
2. assign findings issues to repository projects
3. assign findings issues to organization projects

For details on the GitHub Actions workflow that implements this service, see this [PR](https://github.com/CMSgov/macpro-quickstart-serverless/pull/319) in the [CMSgov/mapcro-quickstart-serverless repo](https://github.com/CMSgov/macpro-quickstart-serverless).

The reference docs for AWS resources referenced in serverless.yml are here:
- [functions](https://www.serverless.com/framework/docs/providers/aws/guide/functions)

## Service-Specific Configuration Parameters

The following values are used to configure the deployment of this service (see below for more background and context).
| Parameter | Required? | Accepts a default? | Accepts a branch override? | Purpose |
| --- | :---: | :---: | :---: | --- |
| .../sechub/githubAccessToken | Y | Y | Y | This is a personal access token of a GitHub user, and is required. The token's owner must have push privileges to the repository. If you're adding issues to an Org Project board (using githubOrganizationProjects as specified below), the token's owner must have permissions to modify Org level Project boards. The token creation process has good detail on which permissions grant what access, and should be straightforward.|
| .../sechub/githubRepository | N | Y | Y | Not required, and very unlikely to be used. By default, the GitHub repository for which issues will be modified is set to this service's repo. In other words, this service and lambda will modify issues in the repo that built it. This parameter exists in the event a user wants to push issues to a different repository. Please don't bother with this parameter unless you're sure it's something you want, because you don't need it; if you're confused by this explanation, forget it, because you don't need this.|
| .../sechub/githubRepositoryProjects | N | Y | Y | Not required, but recomended. This holds the names of repo-owned GitHub Projects to which you'd like to add your GitHub Issues. The parameter is a comma-delimited string containing one or more Project names. If a value is not specified, the service will still create and manage Issues in the target repository... the issues just won't be added to any Project boards.|
| .../sechub/githubOrganizationProjects | N | Y | Y | Not required, but recomended. This holds the names of organization-owned GitHub Projects to which you'd like to add your GitHub Issues. This functions exactly like githubRepositoryProjects (above), but is for Organization level Project boards. This can be useful if, for instance, you'd like 'n' number of projects to create issues, add them to their project board, but then also add them to an Org-wide board; this would give insight into the security hub findings for all participants in the organization.|
| .../sechub/severity | N | Y | Y | Not required. This defines the Security Hub Finding severity level(s) for which you'd like to create Issues. This is a comma-delimited string containing one or more labels. By default, this is set to collect CRITICAL and HIGH severity findings.|
