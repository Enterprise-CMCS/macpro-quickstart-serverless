
import * as elasticsearch from "./libs/elasticsearch-lib";
var mapping = require('./mappings/mapping.json');

function myHandler(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  elasticsearch.addMapping(mapping, process.env.INDEX, process.env.ES_ENDPOINT, 'us-east-1');
}

exports.handler = myHandler;
