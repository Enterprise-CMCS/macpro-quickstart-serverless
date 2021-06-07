"use strict";
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const _ = require("lodash");

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      "webpack:compile:compile": this.readyFilesForIdempotentZipping.bind(this),
    };

    // this.hooks = {
    //   "package:compileEvents": this.thrower.bind(this),
    // };
  }

  // thrower() {
  //   throw("thrownnn");
  // }

  readyFilesForIdempotentZipping() {
    this.serverless.cli.log(
      "Readying function files for idempotent zipping..."
    );

    // Tell the zip command to forego creating directory entries in the archive, via the ZIPOPT variable.
    // see:  https://linux.die.net/man/1/zip
    process.env.ZIPOPT = "-D";

    const serviceDir = this.serverless.serviceDir;
    const time = new Date("631152000000");

    // Discover the functions ready to be packed.
    var dirs;
    if (isIndividialPackaging.call(this)) {
      const functionNames = this.options.function
        ? [this.options.function]
        : this.serverless.service.getAllFunctions();
      dirs = functionNames;
      console.log(functionNames);
      if(this.serverless.service.provider.logs && this.serverless.service.provider.logs.restApi && this.serverless.service.provider.logs.restApi){
        functionNames.push("custom-resources");
      }
      console.log(functionNames);
    } else {
      dirs = ["service"];
    }

    // Iterate over each function directory, glob all files, and reset atime and mtime
    // see:  https://medium.com/@pat_wilson/building-deterministic-zip-files-with-built-in-commands-741275116a19
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
