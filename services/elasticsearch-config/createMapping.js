
import * as elasticsearch from "./libs/elasticsearch-lib";

function amendmentsHandler(event, context, callback) {
  var mapping = require('./mappings/amendments.json');
  console.log('Received event:', JSON.stringify(event, null, 2));
  elasticsearch.addMapping(mapping, process.env.INDEX, process.env.ES_ENDPOINT, 'us-east-1');
}

exports.amendmentsHandler = amendmentsHandler;
