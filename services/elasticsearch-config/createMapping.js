
import AWS from "aws-sdk";
var mapping = require('./mappings/mapping.json');

function myHandler(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  addMapping(mapping, process.env.INDEX, process.env.ES_ENDPOINT, 'us-east-1');
}

export function addMapping(mapping, index, domain, region) {
  var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = 'PUT';
  request.path += index + '/_mapping';
  request.body = JSON.stringify(mapping);
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';
  request.headers['Content-Length'] = Buffer.byteLength(request.body);

  var credentials = new AWS.EnvironmentCredentials('AWS');
  var signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());

  var client = new AWS.HttpClient();
  client.handleRequest(request, null, function(response) {
    console.log(response.statusCode + ' ' + response.statusMessage);
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log('Response body: ' + responseBody);
    });
  }, function(error) {
    console.log('Error: ' + error);
  });
}

exports.handler = myHandler;
