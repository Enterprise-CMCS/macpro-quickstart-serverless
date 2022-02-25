import handler from "./../libs/handler-lib";
import { execSync } from "child_process";
import * as fs from "fs";

export const prince = async (event, context) => {
  // If this invocation is a prewarm, do nothing and return.
  if (event && event.source == "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }

  if (!event || !event.body) {
    throw new Error("No data.");
  }

  const body = event.body;
  const b64EncodedString = Buffer.from(body, "base64");

  let html = b64EncodedString.toString("ascii");
  fs.writeFileSync("/tmp/input", html);
  try {
    let result = execSync(`/opt/prince /tmp/input -o - --pdf-profile=PDF/UA-1`);
    return result.toString("base64");
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const main = handler(prince);
