'use strict';

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'package:createDeploymentArtifacts': this.repackZips.bind(this),
    };
  }

  repackZips() {
    this.serverless.cli.log('Repacking zips to be idempotent...');
  }
}

module.exports = ServerlessPlugin;
