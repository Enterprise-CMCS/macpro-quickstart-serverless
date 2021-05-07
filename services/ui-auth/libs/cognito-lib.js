var aws = require("aws-sdk");
const COGNITO_CLIENT = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});

export async function createUser(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminCreateUser(params, function (err, data) {
      var response;
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

export async function setPassword(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminSetUserPassword(params, function (err, data) {
      if (err) {
        console.log("FAILED to update password", err, err.stack); // an error occurred
        var response = {
          statusCode: 500,
          body: { message: "FAILED", error: err },
        };
        reject(response);
      } else {
        console.log("SUCCESS", data);
        resolve();
      }
    });
  });
}

export async function updateUserAttributes(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminUpdateUserAttributes(params, function (err, data) {
      if (err) {
        console.log("FAILED to update user attributes", err, err.stack); // an error occurred
        var response = {
          statusCode: 500,
          body: { message: "FAILED", error: err },
        };
        reject(response);
      } else {
        console.log("SUCCESS", data);
        resolve();
      }
    });
  });
}
