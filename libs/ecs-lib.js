const AWS = require("aws-sdk");
const ecs = new AWS.ECS();

function listTasks(params) {
  return ecs.listTasks(params).promise();
}

export async function listTasksAsync(params) {
  var error;
  var response = await listTasks(params).catch((err) => (error = err));
  return [error, response];
}

function describeTasks(params) {
  return ecs.describeTasks(params).promise();
}

export async function describeTasksAsync(params) {
  var error;
  var response = await describeTasks(params).catch((err) => (error = err));
  return [error, response];
}
