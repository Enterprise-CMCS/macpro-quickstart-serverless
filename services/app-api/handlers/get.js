import handler from "./../libs/handler-lib";
import dynamoDb from "./../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  // If this invocation is a pre-warm, do nothing and return.
  if (event.source == "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }

  const result = await dynamoDb.get({
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      amendmentId: event.pathParameters.id,
    },
  });
  if (!result.Item) {
    throw new Error("Item not found.");
  }
  console.log("Sending back result:", JSON.stringify(result, null, 2));

  // Return the retrieved item
  return result.Item;
});
