var aws = require("aws-sdk");
const COGNITO_CLIENT = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});
const userPoolId = process.env.userPoolId;

async function myHandler(event, context, callback) {
  console.log("USER POOL ID: ");
  console.log(userPoolId);
  const users = [
    {
      username: "billy@example.com",
      attributes: [
        {
          Name: "email",
          Value: "billy@example.com",
        },
        {
          Name: "given_name",
          Value: "Billy",
        },
        {
          Name: "family_name",
          Value: "Bob",
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    },
    {
      username: "alice@example.com",
      attributes: [
        {
          Name: "email",
          Value: "alice@example.com",
        },
        {
          Name: "given_name",
          Value: "Alice",
        },
        {
          Name: "family_name",
          Value: "Cooper",
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    },
  ];

  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
    var poolData = {
      UserPoolId: userPoolId,
      Username: users[i].username,
      DesiredDeliveryMediums: ["EMAIL"],
      TemporaryPassword: "Abc@321456!",
      UserAttributes: users[i].attributes,
    };
    var passwordData = {
      Password: "BoatThatBass!!",
      UserPoolId: userPoolId,
      Username: users[i].username,
      Permanent: true
    };
    await createUser(poolData);
    await setPassword(passwordData);
  //}
}

async function createUser(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminCreateUser(params, function (err, data) {
      if (err) {
        // console.log("FAILED ", err, err.stack); // an error occurred
        // response = { statusCode: 500, body: { message: "FAILED", error: err } };
        // reject();
        console.log("FAILED ", err, err.stack); // an error occurred
        response = { statusCode: 500, body: { message: "FAILED", error: err } };
        resolve();
      } else {
        console.log("SUCCESS", data); // successful response
        response = { statusCode: 200, body: { message: "SUCCESS" } };
        resolve();
      }
    });
  });
}

async function setPassword(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminSetUserPassword(params, function (err, data) {
      if (err) {
        console.log("FAILED to update password", err, err.stack); // an error occurred
        //response = { statusCode: 500, body: { message: "FAILED", error: err } };
        reject();
      } else {
        console.log("SUCCESS", data);
        resolve();
      }
    });
  });
}
}

exports.handler = myHandler;
