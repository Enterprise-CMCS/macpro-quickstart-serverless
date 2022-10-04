import * as aws from "aws-sdk";
const COGNITO_CLIENT = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});
import * as types from "../types"

export async function createUser(params: types.poolDataType) {
  await new Promise((resolve, _reject) => {
    COGNITO_CLIENT.adminCreateUser(params, function (err: any, data: object) {
      let response;
      if (err) {
        console.log("FAILED ", err, err.stack); // an error occurred
        response = { statusCode: 500, body: { message: "FAILED", error: err } };
        resolve(response); //if user already exists, we still continue and ignore
      } else {
        console.log("SUCCESS", data); // successful response
        response = { statusCode: 200, body: { message: "SUCCESS" } };
        resolve(response);
      }
    });
  });
}

export async function setPassword(params: types.passwordDataType) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminSetUserPassword(params, function (err: any, data: object) {
      if (err) {
        console.log("FAILED to update password", err, err.stack); // an error occurred
        let response = {
          statusCode: 500,
          body: { message: "FAILED", error: err },
        };
        reject(response);
      } else {
        console.log("SUCCESS", data);
        resolve(null);
      }
    });
  });
}

export async function updateUserAttributes(params: types.attributeDataType) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminUpdateUserAttributes(params, function (err: any, data: object) {
      if (err) {
        console.log("FAILED to update user attributes", err, err.stack); // an error occurred
        let response = {
          statusCode: 500,
          body: { message: "FAILED", error: err },
        };
        reject(response);
      } else {
        console.log("SUCCESS", data);
        resolve(null);
      }
    });
  });
}
