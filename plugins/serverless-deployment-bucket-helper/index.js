"use strict";

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      "aws:deploy:deploy:createStack": this.enableVersioning.bind(this),
    };
  }

  enableVersioning() {
    this.serverless.cli.log(
      "Enabling versioning for ServerlessDeploymentBucket..."
    );
    const template =
      this.serverless.service.provider.compiledCloudFormationTemplate;
    if (template.Resources.ServerlessDeploymentBucket) {
      template.Resources.ServerlessDeploymentBucket.Properties.VersioningConfiguration =
        {
          Status: "Enabled",
        };
    }
  }
}

module.exports = ServerlessPlugin;
