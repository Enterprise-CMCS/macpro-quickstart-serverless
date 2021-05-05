var aws = require("aws-sdk");
const COGNITO_CLIENT = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const userPoolId = process.env.userPoolId;

async function myHandler(event, context, callback) {
  console.log("USER POOL ID: ");
  console.log(userPoolId);
  const users = [
    {
      username: "alice",
      attributes: [
        {
          Name: "email",
          Value: "alice@example.com"
        },
        {
          Name: "given_name",
          Value: "Alice"
        },
        {
          Name: "family_name",
          Value: "Foo"
        },
        {
          Name: "email_verified",
          Value: "true"
        }
      ]
    },
  ];

  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
    var poolData = {
        UserPoolId: userPoolId,
        Username: users[i].username,
        DesiredDeliveryMediums: ["EMAIL"],
        TemporaryPassword: "Abc@321",
        UserAttributes: users[i].attributes
      };
      await COGNITO_CLIENT.adminCreateUser(poolData, (error, data) => {
        console.log(error);
        console.log(data);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(data)
        });
      });
  }
}



exports.handler = myHandler;
