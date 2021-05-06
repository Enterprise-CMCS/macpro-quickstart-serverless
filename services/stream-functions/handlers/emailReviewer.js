import * as ses from "./../libs/ses-lib";

exports.handler = function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  event.Records.forEach(function (record) {
    var params = (function (eventName) {
      switch (eventName) {
        case "INSERT":
          return ses.getSESEmailParams({
            ToAddresses: [process.env.reviewerEmail],
            fromAddressSource: process.env.emailSource,
            Subject: `New APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`,
            HTML: getReviewerEmailBody(
              record,
              "A new APS submission has been received."
            ),
          });
        case "MODIFY":
          return ses.getSESEmailParams({
            ToAddresses: [process.env.reviewerEmail],
            fromAddressSource: process.env.emailSource,
            Subject: `Updated APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`,
            HTML: getReviewerEmailBody(
              record,
              "An update to an existing APS submission has been received."
            ),
          });
        case "REMOVE":
          return ses.getSESEmailParams({
            ToAddresses: [process.env.reviewerEmail],
            fromAddressSource: process.env.emailSource,
            Subject: `Updated APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`,
            HTML: getReviewerEmailBody(
              record,
              "A request to delete the below APS request has been processed."
            ),
          });
        default:
          return 30;
      }
    })(record.eventName);

    ses.sendEmail(params);
  });
  callback(null, "message");
};

function getReviewerEmailBody(record, summary) {
  return `
Hi,

${summary}

Details:
- APS ID (Transmittal Number):  ${record.dynamodb.NewImage.transmittalNumber.S}
State:  ${record.dynamodb.NewImage.territory.S}
Submitter Name:  ${record.dynamodb.NewImage.firstName.S} ${record.dynamodb.NewImage.lastName.S}
Submitter Contact Email:  ${record.dynamodb.NewImage.email.S}

Regards,
APS Submission App

`;
}
