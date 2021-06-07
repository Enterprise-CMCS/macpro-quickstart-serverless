"use strict";

const _ = require("lodash");
const Class = require("class.extend");
const extract = require('extract-zip');
const fs = require("fs");
const glob = require("glob");
const path = require("path");
var zip = require('bestzip');


module.exports = Class.extend({
  init: function (serverless, opts) {
    this._serverless = serverless;
    this._opts = opts;

    this.hooks = {
      "before:deploy:deploy": this.helpApiLoggingEnablementBeIdempotent.bind(
        this
      ),
      "package:compileEvents": this.repackCustomResourcesZip.bind(
        this
      ),
    };
  },

  repackCustomResourcesZip: async function() {
    const time = new Date(1990, 1, 1);
    const serviceDir = this._serverless.serviceDir;
    const serverlessDir = `${serviceDir}/.serverless`
    const artifact = "custom-resources.zip"
    const artifactFullPath = `${serverlessDir}/${artifact}`
    // Tell the zip command to forego creating directory entries in the archive, via the ZIPOPT variable.
    // see:  https://linux.die.net/man/1/zip
    process.env.ZIPOPT = "-D";
    var artifactZip = `${serverlessDir}/${artifact}`;
    var targetDir = `${serverlessDir}/tmp`;

    fs.rmdir(targetDir, { recursive: true }, (err) => {
      if (err) {
          console.log('targetDir does not exist')
      }
      console.log(`${targetDir} is deleted!`);
    });
    await extract(artifactFullPath, { dir: targetDir })

    let files = glob.sync(`${targetDir}/**/*`, {
      dot: true,
      silent: true,
      follow: true,
    });
    console.log('asdf');
    files.forEach((file) => {
      console.log(file);
      fs.utimesSync(file, time, time);
    });
    // var relativeSourcePath = path.relative(dotServerlessDir, targetDir)
    // var relativeDestinationPath = path.relative(dotServerlessDir, customResourcesZip)
    var zipArgs = {
      source: `.`,
      cwd: targetDir,
      destination: `../${artifact}.new`
    }
    console.log(zipArgs);
    await zip(zipArgs).then(function() {
      console.log('all done!');
    }).catch(function(err) {
      console.error(err.stack);
      process.exit(1);
    });

    fs.copyFileSync(`${artifactFullPath}.new`, artifactFullPath);

  },

  helpApiLoggingEnablementBeIdempotent: function () {
    const template = this._serverless.service.provider
      .compiledCloudFormationTemplate;
    const providerConfig = this._serverless.service.provider;
    var iamRolePath;
    var iamRolePermissionsBoundary;
    var cloudwatchRoleForApiGatewayConfig = {
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

    // If rest api logs are configured to be enabled...
    if (providerConfig.logs && providerConfig.logs.restApi) {
      // If a specific IAM path is set at the provider level, set iamRolePath
      if (
        providerConfig.iam &&
        providerConfig.iam.role &&
        providerConfig.iam.role.path
      ) {
        iamRolePath = providerConfig.iam.role.path;
        template.Resources.IamRoleCustomResourcesLambdaExecution.Properties.Path = iamRolePath;
        cloudwatchRoleForApiGatewayConfig.Properties.Path = iamRolePath;
      }
      // If a specific IAM perm boundary is set at the provider level, set iamRolePermissionsBoundary
      if (
        providerConfig.iam &&
        providerConfig.iam.role &&
        providerConfig.iam.role.permissionsBoundary
      ) {
        iamRolePermissionsBoundary =
          providerConfig.iam.role.permissionsBoundary;
        template.Resources.IamRoleCustomResourcesLambdaExecution.Properties.PermissionsBoundary = iamRolePermissionsBoundary;
        cloudwatchRoleForApiGatewayConfig.Properties.PermissionsBoundary = iamRolePermissionsBoundary;
      }
      template.Resources.CloudWatchRoleForApiGW = cloudwatchRoleForApiGatewayConfig;
      template.Resources.CustomApiGatewayAccountCloudWatchRole.Properties.RoleArn = {
        "Fn::GetAtt": ["CloudWatchRoleForApiGW", "Arn"],
      };
      // console.log(JSON.stringify(template.Resources));
      this._serverless.cli.log("Enabled logging for ApiGateway Stage");
    } else {
      this._serverless.cli.log("API Gateway logging not enabled...");
    }
  },
});

function copyArtifactByName(artifactName) {
  const { webpackArtifact, serverlessArtifact } = getArtifactLocations.call(this, artifactName);

  // Make sure the destination dir exists
  this.serverless.utils.writeFileDir(serverlessArtifact);

  fs.copyFileSync(webpackArtifact, serverlessArtifact);
}
