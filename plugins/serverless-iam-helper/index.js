"use strict";
const _ = require("lodash");

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.hooks = {
      "before:deploy:deploy": this.iamPathAndPermissionsBoundaryHelp.bind(this),
    };
  }

  iamPathAndPermissionsBoundaryHelp() {
    addRoleForApiLogging.call(this);
    addProperties.call(this);
  }
}

function addRoleForApiLogging() {
  if (apiLoggingEnabled.call(this)) {
    const iamPath = iamPathSpecified.call(this);
    const iamPermissionBoundary = iamPermissionsBoundarySpecified.call(this);
    var cloudwatchRoleForApiLogging = {
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
    const template =
      this.serverless.service.provider.compiledCloudFormationTemplate;
    template.Resources.CloudWatchRoleForApiGatewayLogging =
      cloudwatchRoleForApiLogging;
    template.Resources.CustomApiGatewayAccountCloudWatchRole.Properties.RoleArn =
      {
        "Fn::GetAtt": ["CloudWatchRoleForApiGatewayLogging", "Arn"],
      };
  }
}

function addProperties() {
  const iamPath = iamPathSpecified.call(this);
  if (iamPath) {
    setPropertyForTypes.call(this, ["AWS::IAM::Role"], "Path", iamPath);
  }
  const iamPermissionBoundary = iamPermissionsBoundarySpecified.call(this);
  if (iamPermissionBoundary) {
    setPropertyForTypes.call(
      this,
      ["AWS::IAM::Role"],
      "PermissionsBoundary",
      iamPermissionBoundary
    );
  }
}

function setPropertyForTypes(types, property, value) {
  const template =
    this.serverless.service.provider.compiledCloudFormationTemplate;
  Object.keys(template.Resources).forEach(function (key) {
    if (types.includes(template.Resources[key]["Type"])) {
      template.Resources[key]["Properties"][property] = value;
    }
  });
}

function apiLoggingEnabled() {
  return _.get(this.serverless, "service.provider.logs.restApi");
}

function iamPathSpecified() {
  return _.get(this.serverless, "service.provider.iam.role.path");
}

function iamPermissionsBoundarySpecified() {
  return _.get(
    this.serverless,
    "service.provider.iam.role.permissionsBoundary"
  );
}

module.exports = ServerlessPlugin;
