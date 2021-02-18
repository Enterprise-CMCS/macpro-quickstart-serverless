var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });

exports.handler = function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  event.Records.forEach(function (record) {
    var params = (function (eventName) {
      switch (eventName) {
        case "INSERT":
          return insertParams(record);
        case "MODIFY":
          return modifyParams(record);
        case "REMOVE":
          return removeParams(record);
        default:
          return 30;
      }
    })(record.eventName);

    ses.sendEmail(params, function (err, data) {
      callback(null, { err: err, data: data });
      if (err) {
        console.log(err);
        context.fail(err);
      } else {
        console.log(data);
        context.succeed(event);
      }
    });
  });
  callback(null, "message");
};

function insertParams(record) {
  return {
    Destination: {
      ToAddresses: [record.dynamodb.NewImage.email.S],
    },
    Message: {
      Body: {
        Text: {
          Data: `
Hi ${record.dynamodb.NewImage.firstName.S},

We are writing to let you know we've received your Amendment to Planned Settlement (APS) submission!
It is under review.
No additional action is needed on your part.

APS ID: ${record.dynamodb.NewImage.transmittalNumber.S}

Thank you for using our APS submission system!

Regards,
APS Team

`,
        },
      },
      Subject: {
        Data: `New ACME APS submission received! - ${record.dynamodb.NewImage.transmittalNumber.S}`,
      },
    },
    Source: process.env.emailSource,
  };
}

function modifyParams(record) {
  return {
    Destination: {
      ToAddresses: [record.dynamodb.NewImage.email.S],
    },
    Message: {
      Body: {
        Text: {
          Data: `
Hi ${record.dynamodb.NewImage.firstName.S},

We are writing to let you know we've received an update to your Amendment to Planned Settlement (APS) submission!
It is under review.
No additional action is needed on your part.

APS ID: ${record.dynamodb.NewImage.transmittalNumber.S}

Thank you for using our APS submission system!

Regards,
APS Team

`,
        },
      },
      Subject: {
        Data: `Updated ACME APS submission received! - ${record.dynamodb.NewImage.transmittalNumber.S}`,
      },
    },
    Source: process.env.emailSource,
  };
}

function removeParams(record) {
  return {
    Destination: {
      ToAddresses: [record.dynamodb.OldImage.email.S],
    },
    Message: {
      Body: {
        Text: {
          Data: `
Hi ${record.dynamodb.OldImage.firstName.S},

We received a request to delete your Amendment to Planned Settlement (APS) submission.
We are writing to let you know that we have processed that request.
No additional action is needed on your part.

APS ID: ${record.dynamodb.OldImage.transmittalNumber.S}

Thank you for using our APS submission system!

Regards,
APS Team

`,
        },
      },
      Subject: {
        Data: `Your ACME APS submission has been deleted - ${record.dynamodb.OldImage.transmittalNumber.S}`,
      },
    },
    Source: process.env.emailSource,
  };
}
