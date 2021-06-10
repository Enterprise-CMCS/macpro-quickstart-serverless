"use strict";

const fs = require("fs");
const glob = require("glob");
const path = require("path");
const ServerlessPluginWarmup = require("serverless-plugin-warmup");

class ServerlessPlugin extends ServerlessPluginWarmup {
  constructor(serverless, options) {
    super(serverless, options);

    this.serverless = serverless;
    this.options = options;
    this.hooks["after:warmup:addWarmers:addWarmers"] = function () {
      const serviceDir = this.serverless.serviceDir;
      const warmerNames = this.options.warmers
        ? this.options.warmers.split(",")
        : Object.entries(this.configsByWarmer)
            .filter(([, warmerConfig]) => warmerConfig.prewarm)
            .map(([warmerName]) => warmerName);
      warmerNames.map((warmerName) => {
        const folderName = this.configsByWarmer[warmerName].folderName;
        const indexFile = path.join(folderName, "index.js");
        fs.readFile(indexFile, "utf8", function (err, data) {
          if (err) {
            return console.log(err);
          }
          var result = data.replace(
            /^.*Generated by Serverless WarmUp Plugin.*$/gm,
            ""
          );
          fs.writeFile(indexFile, result, "utf8", function (err) {
            if (err) return console.log(err);
          });
        });
      });
    }.bind(this);
    this.hooks["before:package:createDeploymentArtifacts"] = () =>
      this.serverless.pluginManager.spawn("warmup:addWarmers");
  }
}

module.exports = ServerlessPlugin;
