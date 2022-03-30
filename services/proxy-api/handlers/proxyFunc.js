import handler from "../../app-api/libs/handler-lib";
const axios = require("axios");

export const proxyFunc = async (event) => {
  let response = {};
  let api_endpoint = process.env.proxyApi;

  await axios({
    method: "POST",
    url: api_endpoint,
    data: event["body"],
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      response = {
        statusCode: 200,
        response: result.data,
      };
    })
    .catch((error) => {
      response = {
        error,
      };
    });
  return response.response;
};

export const main = handler(proxyFunc);
