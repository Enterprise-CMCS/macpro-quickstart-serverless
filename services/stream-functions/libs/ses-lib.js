const AWS = require("aws-sdk");
var ses = new AWS.SES({ region: "us-east-1" });

export function sendEmail(params){
  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
}
