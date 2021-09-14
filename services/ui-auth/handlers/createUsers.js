import * as cognitolib from "../libs/cognito-lib";
const userPoolId = process.env.userPoolId;
const users = require("../libs/users.json");

async function myHandler(event, context, callback) {
  console.log("USER POOL ID: ");
  console.log(userPoolId);

  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
    var poolData = {
      UserPoolId: userPoolId,
      Username: users[i].username,
      DesiredDeliveryMediums: ["EMAIL"],
      UserAttributes: users[i].attributes,
    };
    var passwordData = {
      Password: process.env.bootstrapUsersPassword,
      UserPoolId: userPoolId,
      Username: users[i].username,
      Permanent: true,
    };
    var attributeData = {
      Username: users[i].username,
      UserPoolId: userPoolId,
      UserAttributes: users[i].attributes,
    };

    await cognitolib.createUser(poolData);
    //userCreate must set a temp password first, calling setPassword to set the password configured in SSM for consistent dev login
    await cognitolib.setPassword(passwordData);
    //if user exists and attributes are updated in this file updateUserAttributes is needed to update the attributes
    await cognitolib.updateUserAttributes(attributeData);
  }
}

exports.handler = myHandler;
