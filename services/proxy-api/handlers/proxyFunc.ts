import handler from "../libs/handler-lib";
const axios = require("axios");
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const proxyFunc = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let response: any = {};
  let api_endpoint = process.env.proxyApi;

  await axios({
    method: "POST",
    url: api_endpoint,
    data: event["body"],
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result: any) => {
      response = {
        statusCode: 200,
        response: result.data,
      };
    })
    .catch((error: any) => {
      response = {
        error,
      };
    });
  return response.response;
};

export const main = handler(proxyFunc);
