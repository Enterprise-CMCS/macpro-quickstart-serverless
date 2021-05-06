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
          Value: "Foo",
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
    await createUser(poolData);
  }
}

async function createUser(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminCreateUser(params, function (err, data) {
      if (err) {
        console.log("FAILED ", err, err.stack); // an error occurred
        response = { statusCode: 500, body: { message: "FAILED", error: err } };
        reject();
      } else {
        console.log("SUCCESS", data); // successful response
        response = { statusCode: 200, body: { message: "SUCCESS" } };
        resolve();
      }
    });
  });
}

exports.handler = myHandler;
