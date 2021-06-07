'use strict';
const _ = require("lodash");
const extract = require('extract-zip');
const fs = require("fs");
const glob = require("glob");
const path = require("path");
var zip = require('bestzip');

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      "package:compileEvents": this.repackCustomResourcesZip.bind(this),
    };
  }

  async repackCustomResourcesZip() {
    console.log("OUTSIDE");
    // const time = new Date(1990, 1, 1);
    // const serviceDir = this._serverless.serviceDir;
    // const serverlessDir = `${serviceDir}/.serverless`
    // const artifact = "custom-resources.zip"
    // const artifactFullPath = `${serverlessDir}/${artifact}`
    // // Tell the zip command to forego creating directory entries in the archive, via the ZIPOPT variable.
    // // see:  https://linux.die.net/man/1/zip
    // process.env.ZIPOPT = "-D";
    // var artifactZip = `${serverlessDir}/${artifact}`;
    // var targetDir = `${serverlessDir}/tmp`;
    //
    // fs.rmdir(targetDir, { recursive: true }, (err) => {
    //   if (err) {
    //       console.log('targetDir does not exist')
    //   }
    // });
    // await extract(artifactFullPath, { dir: targetDir })
    //
    // let files = glob.sync(`${targetDir}/**/*`, {
    //   dot: true,
    //   silent: true,
    //   follow: true,
    // });
    // files.forEach((file) => {
    //   fs.utimesSync(file, time, time);
    // });
    // var zipArgs = {
    //   source: `.`,
    //   cwd: targetDir,
    //   destination: `../${artifact}.new`
    // }
    // await zip(zipArgs).then(function() {
    //   console.log('all done!');
    // }).catch(function(err) {
    //   console.error(err.stack);
    //   process.exit(1);
    // });
    //
    // fs.copyFileSync(`${artifactFullPath}.new`, artifactFullPath);

  }

  beforeWelcome() {
    this.serverless.cli.log('Hello from Serverless!');
  }

  welcomeUser() {
    this.serverless.cli.log('Your message:');
  }

  displayHelloMessage() {
    this.serverless.cli.log(`${this.options.message}`);
  }

  afterHelloWorld() {
    this.serverless.cli.log('Please come again!');
  }
}

module.exports = ServerlessPlugin;
