
import * as elasticsearch from "./libs/elasticsearch-lib";

function myHandler(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  elasticsearch.createIndex(process.env.INDEX, process.env.ES_ENDPOINT, 'us-east-1');
}

exports.handler = myHandler;
