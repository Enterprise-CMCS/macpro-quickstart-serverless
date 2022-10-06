import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(
  async (
    event: {
      source: string;
      body: string;
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
    const data = JSON.parse(event.body);
    const params = {
      TableName: process.env.tableName,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
        amendmentId: event.pathParameters.id,
      },
      // 'UpdateExpression' defines the attributes to be updated
      // 'ExpressionAttributeValues' defines the value in the update expression
      UpdateExpression:
        "SET email = :email, firstName = :firstName, lastName = :lastName, transmittalNumber = :transmittalNumber, territory = :territory, urgent = :urgent, comments = :comments, attachment = :attachment",
      ExpressionAttributeValues: {
        ":email": data.email,
        ":firstName": data.firstName,
        ":lastName": data.lastName,
        ":transmittalNumber": data.transmittalNumber,
        ":territory": data.territory,
        ":urgent": data.urgent,
        ":comments": data.comments,
        ":attachment": data.attachment || null,
      },
      // 'ReturnValues' specifies if and how to return the item's attributes,
      // where ALL_NEW returns all attributes of the item after the update; you
      // can inspect 'result' below to see how it works with different settings
      ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return { status: true };
  }
);
