const AWS = require("aws-sdk");
var ses = new AWS.SES({ region: "us-east-1" });

export function getSESEmailParams(email) {
  let emailParams = {
    Destination: {
      ToAddresses: email.ToAddresses,
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: email.Text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: email.Subject,
      },
    },
    Source: email.Source,
  };

  return emailParams;
}

export function sendEmail(params) {
  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
}
