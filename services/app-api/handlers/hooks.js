const {
  CodeDeployClient,
  PutLifecycleEventHookExecutionStatusCommand,
} = require("@aws-sdk/client-codedeploy");
const codedeploy = new CodeDeployClient({ apiVersion: "2014-10-06" });

export const preCreate = async (event) => {
  const { DeploymentId, LifecycleEventHookExecutionId } = event;

  console.log("Check some stuff before shifting traffic...");
  console.log("event: ", event);
  console.log("deploymentId: ", DeploymentId);

  const params = {
    deploymentId: DeploymentId,
    lifecycleEventHookExecutionId: LifecycleEventHookExecutionId,
    status: "Succeeded", // status can be 'Succeeded' or 'Failed'
  };

  const command = new PutLifecycleEventHookExecutionStatusCommand(params);

  try {
    const data = await codedeploy.send(command);
    console.log("validating preCreate hook...");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const postCreate = async (event) => {
  const { DeploymentId, LifecycleEventHookExecutionId } = event;

  console.log("Check some stuff after shifting traffic...");

  const params = {
    deploymentId: DeploymentId,
    lifecycleEventHookExecutionId: LifecycleEventHookExecutionId,
    status: "Succeeded", // status can be 'Succeeded' or 'Failed'
  };

  const command = new PutLifecycleEventHookExecutionStatusCommand(params);

  try {
    const data = await codedeploy.send(command);
    console.log("validating postCreate hook...");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
