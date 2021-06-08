"use strict";
const _ = require("lodash");

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.hooks = {
      "before:deploy:deploy": this.addPathAndPermissionsBoundary.bind(this),
    };
  }

  addPathAndPermissionsBoundary() {
    const iamPath = iamPathSpecified.call(this);
    if (iamPath) {
      setPropertyForTypesIfNotSet.call(
        this,
        ["AWS::IAM::Role", "AWS::IAM::Policy"],
        "Path",
        iamPath
      );
    }
    const iamPermissionBoundary = iamPermissionsBoundarySpecified.call(this);
    if (iamPermissionBoundary) {
      setPropertyForTypesIfNotSet.call(
        this,
        ["AWS::IAM::Role"],
        "PermissionsBoundary",
        iamPermissionBoundary
      );
    }
  }
}

function setPropertyForTypesIfNotSet(types, property, value) {
  const template = this.serverless.service.provider
    .compiledCloudFormationTemplate;
  Object.keys(template.Resources).forEach(function (key) {
    if (types.includes(template.Resources[key]["Type"])) {
      if (!template.Resources[key]["Properties"][property]) {
        template.Resources[key]["Properties"][property] = value;
      }
    }
  });
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
