var aws = require("aws-sdk");
const COGNITO_CLIENT = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});
const userPoolId = process.env.userPoolId;

async function myHandler(event, context, callback) {
  console.log("USER POOL ID: ");
  console.log(userPoolId);

  const users = require('./libs/users.json')
  // const users = [
  //   {
  //     username: "paul@example.com",
  //     attributes: [
  //       {
  //         Name: "email",
  //         Value: "paul@example.com",
  //       },
  //       {
  //         Name: "given_name",
  //         Value: "Paul",
  //       },
  //       {
  //         Name: "family_name",
  //         Value: "McCartney",
  //       },
  //       {
  //         Name: "email_verified",
  //         Value: "true",
  //       },
  //     ],
  //   },
  //   {
  //     username: "john@example.com",
  //     attributes: [
  //       {
  //         Name: "email",
  //         Value: "john@example.com",
  //       },
  //       {
  //         Name: "given_name",
  //         Value: "John",
  //       },
  //       {
  //         Name: "family_name",
  //         Value: "Lennon",
  //       },
  //       {
  //         Name: "email_verified",
  //         Value: "true",
  //       },
  //     ],
  //   },
  //   {
  //     username: "george@example.com",
  //     attributes: [
  //       {
  //         Name: "email",
  //         Value: "george@example.com",
  //       },
  //       {
  //         Name: "given_name",
  //         Value: "George",
  //       },
  //       {
  //         Name: "family_name",
  //         Value: "Harrison",
  //       },
  //       {
  //         Name: "email_verified",
  //         Value: "true",
  //       },
  //     ],
  //   },
  // ];

  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
    var poolData = {
      UserPoolId: userPoolId,
      Username: users[i].username,
      DesiredDeliveryMediums: ["EMAIL"],
      TemporaryPassword: "Abc@321456!",
      UserAttributes: users[i].attributes
    };
    var passwordData = {
      Password: process.env.bootstrapUsersPassword,
      UserPoolId: userPoolId,
      Username: users[i].username,
      Permanent: true
    };
    var attributeData = {
      Username: users[i].username,
      UserPoolId: userPoolId,
      UserAttributes: users[i].attributes
    };

    await createUser(poolData);
    //userCreate must set a temp password first, calling setPassword to set the password configured in SSM for consistent dev login
    await setPassword(passwordData);
    //if user exists and attributes are updated in this file updateUserAttributes is needed to update the attributes
    await updateUserAttributes(attributeData);
}

// async function createUser(params) {
//   await new Promise((resolve, reject) => {
//     COGNITO_CLIENT.adminCreateUser(params, function (err, data) {
//       if (err) {
//         console.log("FAILED ", err, err.stack); // an error occurred
//         response = { statusCode: 500, body: { message: "FAILED", error: err } };
//         resolve(); //if user already exists, we still continue and ignore
//       } else {
//         console.log("SUCCESS", data); // successful response
//         response = { statusCode: 200, body: { message: "SUCCESS" } };
//         resolve();
//       }
//     });
//   });
// }
//
// async function setPassword(params) {
//   await new Promise((resolve, reject) => {
//     COGNITO_CLIENT.adminSetUserPassword(params, function (err, data) {
//       if (err) {
//         console.log("FAILED to update password", err, err.stack); // an error occurred
//         response = { statusCode: 500, body: { message: "FAILED", error: err } };
//         reject();
//       } else {
//         console.log("SUCCESS", data);
//         resolve();
//       }
//     });
//   });
// }
//
// async function updateUserAttributes(params) {
//   await new Promise((resolve, reject) => {
//     COGNITO_CLIENT.adminUpdateUserAttributes(params, function (err, data) {
//       if (err) {
//         console.log("FAILED to update user attributes", err, err.stack); // an error occurred
//         response = { statusCode: 500, body: { message: "FAILED", error: err } };
//         reject();
//       } else {
//         console.log("SUCCESS", data);
//         resolve();
//       }
//     });
//   });
// }

}

exports.handler = myHandler;
