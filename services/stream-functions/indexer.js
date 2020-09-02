const { pushStream } = require('dynamodb-stream-elasticsearch');

const { ES_ENDPOINT_URL, INDEX, TYPE } = process.env;

function myHandler(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  pushStream({ event, endpoint: ES_ENDPOINT_URL, index: INDEX, type: TYPE })
    .then(() => {
      callback(null, `Successfully processed ${event.Records.length} records.`);
    })
    .catch((e) => {
      callback(`Error ${e}`, null);
    });
}

exports.handler = myHandler;
