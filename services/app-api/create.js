import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  // If this invokation is a prewarm, do nothing and return.
  if(event.source == "serverless-plugin-warmup" ) {
    console.log("Warmed up!");
    return null;
  }
  const data = JSON.parse(event.body);
  console.log(JSON.stringify(event, null, 2));

  var atomicCounter = require( 'dynamodb-atomic-counter' );
  atomicCounter.config.update({ region: 'us-east-1' });
  const nextValue = await atomicCounter.increment(data.territory, { tableName: process.env.atomicCounterTableName}).done(function (value) {
  }).fail(function (error) {
    console.log(error);
  });

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      amendmentId: uuid.v1(),
      authProvider: event.requestContext.identity.cognitoAuthenticationProvider,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      transmittalNumber: data.territory + '-' + ("000" + nextValue).slice(-4),
      territory: data.territory,
      urgent: data.urgent,
      comments: data.comments,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});
