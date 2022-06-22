import * as connect from "./../../../libs/connect-lib";

const connectors = [];

async function myHandler(event, context, callback) {
  await connect.putConnectors(process.env.cluster, connectors);
  await connect.restartConnectors(process.env.cluster, connectors);
}

exports.handler = myHandler;
