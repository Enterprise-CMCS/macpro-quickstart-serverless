import AWS from "aws-sdk";
import atomicCounter from 'dynamodb-atomic-counter';

const dyanmoConfig = {};

// ugly but OK, here's where we will check the environment
const atomicTableName = process.env.atomicCounterTableName;
const endpoint = process.env.DYNAMODB_URL;
if (endpoint) {
	dyanmoConfig.endpoint = endpoint;
	dyanmoConfig.accessKeyId = 'LOCAL_FAKE_KEY';
	dyanmoConfig.secretAccessKey = 'LOCAL_FAKE_SECRET';
} else {
	dyanmoConfig['region'] = 'us-east-1';
}

const client = new AWS.DynamoDB.DocumentClient(dyanmoConfig);

atomicCounter.config.update(dyanmoConfig);

export default {
  get   : (params) => client.get(params).promise(),
  put   : (params) => client.put(params).promise(),
  query : (params) => client.query(params).promise(),
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
  increment: (params) => atomicCounter.increment(params, { tableName: atomicTableName}),
};
