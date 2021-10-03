var execFile = require("child_process").execFile;
function tinyMultipartParser(data) {
  // assume first line is boundary
  const lines = data.split("\r\n");
  const boundary = lines[0];
  const endboundary = boundary + "--";
  const boundaries = lines.filter((l) => l == boundary).length;
  if (boundaries != 1) {
    throw new Error(`Unexpected boundaries ${boundaries}`);
  }
  const endboundaries = lines.filter((l) => l == endboundary).length;
  if (endboundaries != 1) {
    throw new Error(`Unexpected end boundaries ${boundaries}`);
  }
  const output = [];
  let in_body = false;
  lines.forEach((line) => {
    if (line.trim() == "" && !in_body) {
      in_body = true;
      return;
    }
    if (
      !in_body &&
      line.match(/^content-type: /i) &&
      !line.match(/text\/html/)
    ) {
      throw new Error("not html");
    }
    if (line.indexOf(boundary) > -1) return;
    if (in_body) output.push(line);
  });
  return output.join("\n");
}

exports.main = function (event, context, done) {
  // If this invocation is a prewarm, do nothing and return.
  if (event.source == "serverless-plugin-warmup") {
    console.log("Warmed up!");
    return null;
  }
  if (!event || !event.body) {
    return done(new Error("No data."));
  }
  let body = event.body;
  if (event.isBase64Encoded) {
    body = Buffer.from(body, "base64").toString("ascii");
  }
  let html = tinyMultipartParser(body);
  let opts = {
    timeout: 10 * 1000,
    maxbuffer: 10 * 1024 * 1024,
    encoding: "buffer",
    cwd: "/opt",
  };
  let child = execFile(
    "./prince",
    ["-", "-o", "-"],
    opts,
    function (err, stdout, stderr) {
      if (err) {
        return done(err);
      }
      if (
        err === null &&
        stderr.toString().match(/prince:\s+error:\s+([^\n]+)/)
      ) {
        return done(
          new Error(stderr.toString().match(/prince:\s+error:\s+([^\n]+)/)[1])
        );
      }
      console.log(stdout.toString("base64"));
      done(null, {
        isBase64Encoded: true,
        statusCode: 200,
        headers: { "Content-Type": "application/pdf" },
        body: stdout.toString("base64"),
      });
    }
  );
  child.stdin.write(html);
  child.stdin.end();
};
