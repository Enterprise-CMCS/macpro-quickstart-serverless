const axios =  require('axios');

exports.handler = async (event) => {
  let response = {};
  let api_endpoint = event['princeApi'];

  await axios({ method: 'POST',
      url: api_endpoint,
      "data":"test",
      headers:{
        "Content-Type" : "application/json"
      }
    }).then((result) => {
      response = {
        "statusCode": 200, 
        "headers": {"Content-Type": "application/json"},
        "body": result.data
      };
    }).catch((error) => {
      response = {
        error
    };
  });
  return response;
};