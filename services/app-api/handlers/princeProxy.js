import handler from "./../libs/handler-lib";
const axios =  require('axios');

export const princeProxy = async (event) => {
  let response = {};
  let api_endpoint = event['princeApi'];

  console.log(event['princeApi']);
  console.log(event['body']);

  await axios({ method: 'POST',
      url: api_endpoint,
      data: "",
      headers: {
        "Content-Type" : "application/json"
      }
    }).then((result) => {
      response = {
        statusCode: 200,
        response: result.data
      };
    }).catch((error) => {
      response = {
        error
    };
  });
  return response;
};

export const main = handler(princeProxy);