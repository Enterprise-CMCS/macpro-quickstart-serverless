import handler from "./../libs/handler-lib";
import dynamoDb from "./../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  // If this invokation is a prewarm, do nothing and return.
  if(event.source == "serverless-plugin-warmup" ) {
    console.log("Warmed up!");
    return null;
  }

  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'amendmentId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      amendmentId: event.pathParameters.id
    }
  };

  const result = await dynamoDb.get(params);
  if ( ! result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
