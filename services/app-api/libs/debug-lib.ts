import util from "util";
import AWS from "aws-sdk";
import * as debugLib from "./debug-lib";

let logs: Record<string, any>[];

// Log AWS SDK calls
AWS.config.logger = { log: debug };

export function debug(...rest: any) {
  logs.push({
    date: new Date(),
    string: util.format.apply(null, [...rest]),
  });
}

export function init(event: any, context: any) {
  logs = [];

  // Log API event
  debugLib.debug("API event", {
    body: event.body,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
  });
}

export function flush(e: any) {
  logs.forEach(({ date, string }) => console.debug(date, string));
  console.error(e);
}
