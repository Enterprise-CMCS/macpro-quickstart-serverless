"use strict";

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      online: {
        usage: "Used for fast lambda development against AWS.",
        lifecycleEvents: ["start"],
        options: {
          function: {
            usage:
              "Specify the function you want to develop with serverless-online ",
            required: true,
            shortcut: "f",
          },
        },
      },
    };

    this.hooks = {
      "before:online:start": this.beforeStart.bind(this),
      "online:start": this.startOnline.bind(this),
      "after:online:start": this.afterStart.bind(this),
    };
  }

  beforeStart() {
    this.serverless.cli.log(
      `Starting online development mode for function ${this.options.function}...`
    );
  }

  async startOnline() {
    await this.serverless.pluginManager.spawn("webpack");
  }

  afterStart() {
    this.serverless.cli.log("After start...");
  }
}

module.exports = ServerlessPlugin;
