export function success(body: any) {
  return buildResponse(200, body);
}

export function failure(body: any) {
  return buildResponse(500, body);
}

function buildResponse(statusCode: any, body: any) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
  };
}
