import * as cognitolib from "../libs/cognito-lib";
const userPoolId = process.env.userPoolId;
import { users } from "../libs/users";
import {
  APIGatewayProxyResult,
  APIGatewayEvent,
  APIGatewayEventRequestContextV2,
} from "aws-lambda";
import * as types from "../types";

async function myHandler(
  _event: APIGatewayEvent,
  _context: APIGatewayEventRequestContextV2,
  _callback: APIGatewayProxyResult
) {
  console.log("USER POOL ID: ");
  console.log(userPoolId);

  for (let i = 0; i < users.length; i++) {
    console.log(users[i]);
    let poolData: types.poolDataType = {
      UserPoolId: userPoolId,
      Username: users[i].username,
      DesiredDeliveryMediums: ["EMAIL"],
      UserAttributes: users[i].attributes,
    };
    let passwordData: types.passwordDataType = {
      Password: process.env.bootstrapUsersPassword,
      UserPoolId: userPoolId,
      Username: users[i].username,
      Permanent: true,
    };
    let attributeData: types.attributeDataType = {
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
