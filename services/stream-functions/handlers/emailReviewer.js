
var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});

exports.handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
      var params = (function(eventName) {
        switch(eventName) {
          case 'INSERT':
            return insertParams(record);
          case 'MODIFY':
            return modifyParams(record);
          case 'REMOVE':
            return removeParams(record);
          default:
            return 30;
        }
      })(record.eventName);

      ses.sendEmail(params, function (err, data) {
        callback(null, {err: err, data: data});
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
      ToAddresses: [process.env.reviewerEmail]
    },
    Message: {
      Body: {
        Text: {
          Data: `
Hi,

A new APS submission has been received.

Details:
 - APS ID (Transmittal Number):  ${record.dynamodb.NewImage.transmittalNumber.S}
   State:  ${record.dynamodb.NewImage.territory.S}
   Submitter Name:  ${record.dynamodb.NewImage.firstName.S} ${record.dynamodb.NewImage.lastName.S}
   Submitter Contact Email:  ${record.dynamodb.NewImage.email.S}
   
Regards,
APS Submission App

`
        }
      },
      Subject: {
        Data: `New APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`
      }
    },
    Source: process.env.emailSource
  };
};

function modifyParams(record) {
  return {
    Destination: {
      ToAddresses: [process.env.reviewerEmail]
    },
    Message: {
      Body: {
        Text: {
          Data: `
Hi,

An update to an existing APS submission has been received.

Details:
 - APS ID (Transmittal Number):  ${record.dynamodb.NewImage.transmittalNumber.S}
   State:  ${record.dynamodb.NewImage.territory.S}
   Submitter Name:  ${record.dynamodb.NewImage.firstName.S} ${record.dynamodb.NewImage.lastName.S}
   Submitter Contact Email:  ${record.dynamodb.NewImage.email.S}

Regards,
APS Submission App

`
        }
      },
      Subject: {
        Data: `Updated APS Submission - ${record.dynamodb.NewImage.transmittalNumber.S}`
      }
    },
    Source: process.env.emailSource
  };
};

function removeParams(record) {
  return {
    Destination: {
      ToAddresses: [process.env.reviewerEmail]
    },
    Message: {
      Body: {
        Text: {
          Data: `
Hi,

A request to delete the below APS request has been processed.

Details:
 - APS ID (Transmittal Number):  ${record.dynamodb.OldImage.transmittalNumber.S}
   State:  ${record.dynamodb.NewImage.territory.S}
   Submitter Name:  ${record.dynamodb.NewImage.firstName.S} ${record.dynamodb.OldImage.lastName.S}
   Submitter Contact Email:  ${record.dynamodb.OldImage.email.S}

Regards,
APS Submission App

`
        }
      },
      Subject: {
        Data: `Deleted APS Submission - ${record.dynamodb.OldImage.transmittalNumber.S}`
      }
    },
    Source: process.env.emailSource
  };
};
