"use strict";
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const _ = require("lodash");

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      "webpack:compile:compile": this.repackZips.bind(this),
    };
  }

  repackZips() {
    this.serverless.cli.log("Setting timestamps...");
    const serviceDir = this.serverless.serviceDir;
    const time = new Date("631152000000");

    var dirs;
    if (isIndividialPackaging.call(this)) {
      const functionNames = this.options.function
        ? [this.options.function]
        : this.serverless.service.getAllFunctions();
      dirs = functionNames;
    } else {
      dirs = ["service"];
    }

    dirs.forEach((dir) => {
      var dirPath = `${serviceDir}/.webpack/${dir}/**/*`;
      let files = glob.sync(dirPath, {
        dot: true,
        silent: true,
        follow: true,
      });
      files.forEach((file) => {
        fs.utimesSync(file, time, time);
      });
    });
  }
}

function isIndividialPackaging() {
  return _.get(this.serverless, "service.package.individually");
}

module.exports = ServerlessPlugin;
