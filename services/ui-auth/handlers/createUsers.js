var aws = require("aws-sdk");

const userPoolId = process.env.userPoolId;

export const main = handler(async (event, context) => {
  // If this invokation is a prewarm, do nothing and return.
  // if (event.source == "serverless-plugin-warmup") {
  //   console.log("Warmed up!");
  //   return null;
  // }

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
  return "asdfasdf";
});
