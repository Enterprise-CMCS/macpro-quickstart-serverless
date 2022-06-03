var AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
var lambda = new AWS.Lambda();

export const func1Nate = (event, context) => {
  // Define the input parameters that will be passed on to the child function
  const inputParams = {
    ProductName: "iPhone SE",
    Quantity: 2,
    UnitPrice: 499,
  };
  var params = {
    FunctionName:
      "arn:aws:lambda:us-east-1:677829493285:function:childFunctionTest",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify(inputParams),
  };

  lambda.invoke(params, function (err, data) {
    if (err) {
      console.log(err);
      context.fail(err);
      return err;
    } else {
      console.log(data.Payload);
      context.succeed("Lambda_B said " + data.Payload);
      return data.Payload;
    }
  });
};

module.exports = func1Nate;
