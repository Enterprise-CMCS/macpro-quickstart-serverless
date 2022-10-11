import AWS from "aws-sdk";

const dynamoConfig: any = {};

// ugly but OK, here's where we will check the environment
const atomicTableName = process.env.atomicCounterTableName;
const endpoint = process.env.DYNAMODB_URL;
if (endpoint) {
  dynamoConfig.endpoint = endpoint;
  dynamoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
  dynamoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
} else {
  dynamoConfig["region"] = "us-east-1";
}

const client = new AWS.DynamoDB.DocumentClient(dynamoConfig);

export default {
  get: (params: any) => client.get(params).promise(),
  put: (params: any) => client.put(params).promise(),
  query: (params: any) => client.query(params).promise(),
  update: (params: any) => client.update(params).promise(),
  delete: (params: any) => client.delete(params).promise(),
  increment: (counterId: any) =>
    atomicUpdate(counterId, { tableName: atomicTableName }),
};

function atomicUpdate(counterId: any, options: any) {
  options || (options = {});
  const params: any = {
    Key: {},
    AttributeUpdates: {},
    ReturnValues: "UPDATED_NEW",
    TableName: options.tableName,
  };
  const keyAttribute = options.keyAttribute || "id";
  const countAttribute = options.countAttribute || "lastValue";

  params.Key[keyAttribute] = { S: counterId };
  params.AttributeUpdates[countAttribute] = {
    Action: "ADD",
    Value: {
      N: "" + 1,
    },
  };
  return new AWS.DynamoDB(dynamoConfig).updateItem(params).promise();
}
