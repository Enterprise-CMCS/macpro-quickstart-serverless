import * as ses from "./../libs/ses-lib";

exports.handler = function (event, context, callback) {
  console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
  console.log("Received event:", JSON.stringify(event, null, 2));
  event.Records.forEach(function (record) {
    var params = (function (eventName) {
      switch (eventName) {
        case "INSERT":
          return ses.getSESEmailParams({
            ToAddresses: [process.env.reviewerEmail],
            Source: process.env.emailSource,
            Subject: `New APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`,
            Text: getReviewerEmailBody(
              record.dynamodb.NewImage,
              "A new APS submission has been received."
            ),
          });
        case "MODIFY":
          return ses.getSESEmailParams({
            ToAddresses: [process.env.reviewerEmail],
            Source: process.env.emailSource,
            Subject: `Updated APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`,
            Text: getReviewerEmailBody(
              record.dynamodb.NewImage,
              "An update to an existing APS submission has been received."
            ),
          });
        case "REMOVE":
          return ses.getSESEmailParams({
            ToAddresses: [process.env.reviewerEmail],
            Source: process.env.emailSource,
            Subject: `Updated APS Submission - ${record.dynamodb.OldImage.transmittalNumber.S}`,
            Text: getReviewerEmailBody(
              record.dynamodb.OldImage,
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

function getReviewerEmailBody(image, summary) {
  return `
Hi,

${summary}

Details:
- APS ID (Transmittal Number):  ${image.transmittalNumber.S}
State:  ${image.territory.S}
Submitter Name:  ${image.firstName.S} ${image.lastName.S}
Submitter Contact Email:  ${image.email.S}

Regards,
APS Submission App

`;
}
