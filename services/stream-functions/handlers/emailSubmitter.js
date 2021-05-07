import * as ses from "./../libs/ses-lib";

exports.handler = function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  event.Records.forEach(function (record) {
    var params = (function (eventName) {
      switch (eventName) {
        case "INSERT":
          return reviewerEmailForInsert(record);
        case "MODIFY":
          return reviewerEmailForModify(record);
        case "REMOVE":
          return reviewerEmailForDelete(record);
        default:
          return 30;
      }
    })(record.eventName);

    ses.sendEmail(params);
  });
  callback(null, "message");
};

function reviewerEmailForInsert(record){
  return ses.getSESEmailParams({
    ToAddresses: [record.dynamodb.NewImage.email.S],
    Source: process.env.emailSource,
    Subject: `New ACME APS submission received! - ${record.dynamodb.NewImage.transmittalNumber.S}`,
    Text: `
Hi ${record.dynamodb.NewImage.firstName.S},

We are writing to let you know we've received your Amendment to Planned Settlement (APS) submission!
It is under review.
No additional action is needed on your part.

APS ID: ${record.dynamodb.NewImage.transmittalNumber.S}

Thank you for using our APS submission system!

Regards,
APS Team

`,
  });
}

function reviewerEmailForModify(record) {
  return ses.getSESEmailParams({
    ToAddresses: [record.dynamodb.NewImage.email.S],
    Source: process.env.emailSource,
    Subject: `Updated ACME APS submission received! - ${record.dynamodb.NewImage.transmittalNumber.S}`,
    Text: `
Hi ${record.dynamodb.NewImage.firstName.S},

We are writing to let you know we've received an update to your Amendment to Planned Settlement (APS) submission!
It is under review.
No additional action is needed on your part.

APS ID: ${record.dynamodb.NewImage.transmittalNumber.S}

Thank you for using our APS submission system!

Regards,
APS Team

`,
  });
}

function reviewerEmailForDelete(record) {
  return ses.getSESEmailParams({
    ToAddresses: [record.dynamodb.OldImage.email.S],
    Source: process.env.emailSource,
    Subject: `Your ACME APS submission has been deleted - ${record.dynamodb.OldImage.transmittalNumber.S}`,
    Text: `
Hi ${record.dynamodb.OldImage.firstName.S},

We received a request to delete your Amendment to Planned Settlement (APS) submission.
We are writing to let you know that we have processed that request.
No additional action is needed on your part.

APS ID: ${record.dynamodb.OldImage.transmittalNumber.S}

Thank you for using our APS submission system!

Regards,
APS Team

`,
  });
}
