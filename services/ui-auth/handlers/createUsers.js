var aws = require("aws-sdk");
const userPoolId = process.env.userPoolId;

async function myHandler(event, context, callback) {
  console.log("USER POOL ID: ");
  console.log(userPoolId);
  // const users = [
  //   {
  //     username: "alice",
  //     attributes: {
  //       given_name: "Alice",
  //       family_name: "Foo",
  //       email: "alice@example.com",
  //     },
  //   },
  // ];
}

exports.handler = myHandler;
