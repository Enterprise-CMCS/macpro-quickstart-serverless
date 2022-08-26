import * as uuid from "uuid";
import handler from "./../libs/handler-lib";
import dynamoDb from "./../libs/dynamodb-lib";

// TODO: GIT Test remove
// TODO: GIT Test remove
// TODO: GIT Test remove

export const main = handler(async (event, context) => {
  // If this invocation is a pre-warm, do nothing and return.
  if (event.source == "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }
  const data = JSON.parse(event.body);
  console.log(JSON.stringify(event, null, 2));

  var nextValue = (await dynamoDb.increment(data.territory)).Attributes
    .lastValue.N;

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      amendmentId: uuid.v1(),
      authProvider: event.requestContext.identity.cognitoAuthenticationProvider,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      transmittalNumber: data.territory + "-" + ("000" + nextValue).slice(-4),
      territory: data.territory,
      urgent: data.urgent,
      comments: data.comments,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
