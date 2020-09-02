
// const { ES_ENDPOINT, INDEX, TYPE } = process.env;
var mapping = require('./mappings/mac-change.json');
// var aws = require('aws-sdk');
import AWS from "aws-sdk";
// AWS.config.apiVersions = {
//   es: '2015-01-01',
//   // other service API versions
// };

var region = 'us-east-1'; // e.g. us-west-1
var domain = process.env.ES_DOMAIN; // e.g. search-domain.region.es.amazonaws.com
var index = 'node-test';
var type = '_doc';
var id = '1';
var json = {
  "title": "Moneyball",
  "director": "Bennett Miller",
  "year": "2011"
};

function myHandler(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log(mapping);
  console.log(process.env.ES_ENDPOINT);
  console.log(process.env.ES_DOMAIN);
  console.log(process.env.INDEX);
  console.log(process.env.TYPE);
  //
  // var es = new AWS.ES({
  //   endpoint: process.env.ES_ENDPOINT
  // });
  // console.log(es);

  // var region = 'us-east-1'; // e.g. us-west-1
  // var domain = process.env.ES_DOMAIN; // e.g. search-domain.region.es.amazonaws.com
  // var index = 'node-test';
  // var type = '_doc';
  // var id = '1';
  // var json = {
  //   "title": "Moneyball",
  //   "director": "Bennett Miller",
  //   "year": "2011"
  // }
  indexDocument(json);
}

export function indexDocument(document) {
  var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = 'PUT';
  request.path += index + '/' + type + '/' + id;
  request.body = JSON.stringify(document);
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';
  // Content-Length is only needed for DELETE requests that include a request
  // body, but including it for all requests doesn't seem to hurt anything.
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
