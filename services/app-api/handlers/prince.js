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
  // let child = execFileSync(
  //   "./prince",
  //   // ["-", "-o", "-", "--pdf-profile=PDF/UA-1"],
  //   ["-", "-o", "-"],
  //
  //   opts,
  //   function (err, stdout, stderr) {
  //     if (err) {
  //       return err;
  //     }
  //     if (
  //       err === null &&
  //       stderr.toString().match(/prince:\s+error:\s+([^\n]+)/)
  //     ) {
  //       return (
  //         new Error(stderr.toString().match(/prince:\s+error:\s+([^\n]+)/)[1])
  //       );
  //     }
  //     console.log(stdout.toString("base64"));
  //     return {
  //       isBase64Encoded: true,
  //       statusCode: 200,
  //       headers: {
  //         "Content-Type": "application/pdf",
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Credentials": true,
  //       },
  //       body: stdout.toString("base64"),
  //     };
  //   }
  // );
  // // child.stdin.write(html);
  // // child.stdin.end();
  // console.log(child.stdout);
  // return {
  //   isBase64Encoded: true,
  //   statusCode: 200,
  //   headers: {
  //     "Content-Type": "application/pdf",
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Credentials": true,
  //   },
  // body: child.stdout.toString("base64"),
  // };
});
