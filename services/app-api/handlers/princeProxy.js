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
      console.log(result.data);
      response = {
          status: 200,
          response: result.data
      };
    }).catch((error) => {
      console.log("Error occured: " + error);
      response = {
        error 
    };
  });
  return response;
};