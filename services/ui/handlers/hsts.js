exports.handler = (event, context, callback) => {
  if (event.source == "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }
  const response = event.Records[0].cf.response;
  const headers = response.headers;
  headers["strict-transport-security"] = [
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubdomains; preload",
    },
  ];
  return callback(null, response);
};
