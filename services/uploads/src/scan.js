// This function gets invoked once per uploaded file.
// If two files are uploaded at the same time, this function is called twice.
const AWS = require("aws-sdk");

module.exports.main = async (event, context, callback) => {
  console.info("EVENT\n" + JSON.stringify(event, null, 2));
  console.info("CONTEXT\n" + JSON.stringify(context, null, 2));
  console.info("CALLBACK\n" + JSON.stringify(callback, null, 2));

  console.log("Uploaded object(s)\n" + event.Records[0].s3.object.key);

  const s3 = new AWS.S3();

  return context.logStreamName;
};
