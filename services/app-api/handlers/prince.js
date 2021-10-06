var execSync = require("child_process").execSync;
import handler from "./../libs/handler-lib";

export const main = handler(async (event, context) => {
  // If this invocation is a prewarm, do nothing and return.
  if (event.source == "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }
  if (!event || !event.body) {
    return new Error("No data.");
  }
  let body = event.body;
  if (event.isBase64Encoded) {
    body = Buffer.from(body, "base64").toString("ascii");
  }
  let html = body;
  try {
    let result = execSync(`/opt/prince - -o - <<< ${html}`);
    console.log("stdout: ", result.toString("base64"));
    return result.toString("base64");
  } catch (err) {
    console.log("sdterr: ", err.stderr.toString());
  }
});
