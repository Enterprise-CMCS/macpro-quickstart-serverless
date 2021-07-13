"use strict";

const type = ["AWS::S3::Bucket"];
const property = "VersioningConfiguration";
const versioningConfiguration = {
  Status: "Enabled",
};

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      // This will ensure versioning is enabled for the serverless deployment bucket.
      "aws:deploy:deploy:createStack":
        this.enableVersioningForBuckets.bind(this),

      // This will ensure versioning is enabled for all buckets.
      "before:deploy:deploy": this.enableVersioningForBuckets.bind(this),
    };
  }
  enableVersioningForBuckets() {
    setPropertyForTypes.call(this, type, property, versioningConfiguration);
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

module.exports = ServerlessPlugin;
