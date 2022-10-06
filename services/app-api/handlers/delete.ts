import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(
  async (
    event: {
      source: string;
      requestContext: { identity: { cognitoIdentityId: any } };
      pathParameters: { id: any };
    },
    context: any
  ) => {
    // If this invocation is a pre-warm, do nothing and return.
    if (event.source == "serverless-plugin-warmup") {
      console.log("Warmed up!");
      return null;
    }

    await dynamoDb.delete({
      TableName: process.env.tableName,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
        amendmentId: event.pathParameters.id,
      },
    });

    return { status: true };
  }
);
