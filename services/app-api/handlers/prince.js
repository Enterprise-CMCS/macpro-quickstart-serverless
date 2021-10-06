import handler from "./../libs/handler-lib";
var execSync = require("child_process").execSync;
const fs = require("fs");

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
  let html = Buffer.from(body, "base64").toString("ascii");
  fs.writeFileSync("/tmp/input", html);
  try {
    // ["-", "-o", "-", "--pdf-profile=PDF/UA-1"],
    let result = execSync(`/opt/prince /tmp/input -o - --pdf-profile=PDF/UA-1`);
    return result.toString("base64");
  } catch (err) {
    console.log(err);
  }
});
