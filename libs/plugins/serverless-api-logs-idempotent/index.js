"use strict";

const _ = require("lodash");
const Class = require("class.extend");

module.exports = Class.extend({
  init: function (serverless, opts) {
    this._serverless = serverless;
    this._opts = opts;

    this.hooks = {
      "before:deploy:deploy": this.helpApiLoggingEnablementBeIdempotent.bind(
        this
      ),
    };
  },

  helpApiLoggingEnablementBeIdempotent: function () {
    const template = this._serverless.service.provider
      .compiledCloudFormationTemplate;
    const providerConfig = this._serverless.service.provider;
    var iamRolePath;
    var iamRolePermissionsBoundary;
    var cloudwatchRoleForApiGatewayConfig = {
      Type: "AWS::IAM::Role",
      Properties: {
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: "apigateway.amazonaws.com",
              },
              Action: "sts:AssumeRole",
            },
          ],
        },
        ManagedPolicyArns: [
          "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
        ],
      },
    };

    // If rest api logs are configured to be enabled...
    if (providerConfig.logs && providerConfig.logs.restApi) {
      // If a specific IAM path is set at the provider level, set iamRolePath
      if (
        providerConfig.iam &&
        providerConfig.iam.role &&
        providerConfig.iam.role.path
      ) {
        iamRolePath = providerConfig.iam.role.path;
        template.Resources.IamRoleCustomResourcesLambdaExecution.Properties.Path = iamRolePath;
        cloudwatchRoleForApiGatewayConfig.Properties.Path = iamRolePath;
      }
      // If a specific IAM perm boundary is set at the provider level, set iamRolePermissionsBoundary
      if (
        providerConfig.iam &&
        providerConfig.iam.role &&
        providerConfig.iam.role.permissionsBoundary
      ) {
        iamRolePermissionsBoundary =
          providerConfig.iam.role.permissionsBoundary;
        template.Resources.IamRoleCustomResourcesLambdaExecution.Properties.PermissionsBoundary = iamRolePermissionsBoundary;
        cloudwatchRoleForApiGatewayConfig.Properties.PermissionsBoundary = iamRolePermissionsBoundary;
      }
      template.Resources.CloudWatchRoleForApiGW = cloudwatchRoleForApiGatewayConfig;
      template.Resources.CustomApiGatewayAccountCloudWatchRole.Properties.RoleArn = {
        "Fn::GetAtt": ["CloudWatchRoleForApiGW", "Arn"],
      };
      // console.log(JSON.stringify(template.Resources));
      this._serverless.cli.log("Enabled logging for ApiGateway Stage");
    } else {
      this._serverless.cli.log("API Gateway logging not enabled...");
    }
  },
});
