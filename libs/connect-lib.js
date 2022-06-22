import * as ecs from "./ecs-lib.js";
var http = require("http");
var lodash = require("lodash");

//TODO:  The design of this mechanism assumes that there are N number of configuration items (distinct Java tasks, usually)
//that run against a single ECS task.  This is exampled by the fact that each IP lookup only references the first item in the array,
// which is a hard coded value.  It may be prudent to allow running multiple tasks each with a distinct set of configuration,
//and if that is determined to be the case, quite a bit of refactoring will be required in this library, and in how the configuration
//is passed to this library to facilitate that use case.
export async function getWorkerIps(cluster) {
  var [error, taskList] = await ecs.listTasksAsync({
    cluster: process.env.cluster,
  });
  if (error) {
    console.error(error);
    throw error;
  }
  console.log("Task List", JSON.stringify(taskList));

  var [error2, taskDescriptions] = await ecs.describeTasksAsync({
    cluster: cluster,
    tasks: taskList.taskArns,
  });
  if (error2) {
    console.error(error2);
    throw error2;
  }
  console.log("Task Descriptions", JSON.stringify(taskDescriptions));

  var ipList = [];
  //Attachments, being an array, can have multiple sets of ips attached to a single
  //attachment item within each task.  As such, each attachment item should be parsed
  //to produce the privateIPv4Address, which is currently not the case, so in an instance
  //where a task has multiple interfaces, this code will fail that use case.
  taskDescriptions.tasks.forEach((task) => {
    ipList.push(
      lodash.filter(
        task.attachments[0].details,
        (x) => x.name === "privateIPv4Address"
      )[0].value
    );
  });
  return ipList;
}

const resolver = (req, resolve) => {
  console.log("Finished");
  req.socket.destroy();
  resolve(req.statusCode);
};

export async function putConnector(ip, config) {
  return new Promise((resolve, reject) => {
    var retry = function (e) {
      console.log("Got error: " + e);
      setTimeout(async function () {
        return await putConnector(ip, config);
      }, 5000);
    };
    var options = {
      hostname: ip,
      port: 8083,
      path: `/connectors/${config.name}/config`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const req = http.request(options, (res) => {
      res
        .on("data", (d) => {
          console.log(d.toString("utf-8"));
        })
        .on("error", (error) => {
          console.log(error.toString("utf-8"));
          retry.call(`${error}`);
        })
        .on("end", (d) => {
          resolver(req, resolve);
        });
    });

    req.write(JSON.stringify(config.config));
    req.end();
  });
}

export async function putConnectors(cluster, connectors) {
  var workerIps = await getWorkerIps(cluster);
  for (var i = 0; i < connectors.length; i++) {
    console.log(
      `Configuring connector with config: ${JSON.stringify(
        connectors[i],
        null,
        2
      )}`
    );
    //This won't account for multiple tasks with multiple interfaces
    await putConnector(workerIps[0], connectors[i]);
  }
}

export async function postConnector(ip, config, path) {
  return new Promise((resolve, reject) => {
    var retry = function (e) {
      console.log("Got error: " + e);
      setTimeout(async function () {
        return await postConnector(ip, config, path);
      }, 5000);
    };
    var derivedPath = path ? `/${path}` : "";
    for (var i = 0; i < config.tasks; i++) {
      var options = {
        hostname: ip,
        port: 8083,
        path: `/connectors/${config.name}/tasks/${i}${derivedPath}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const req = http.request(options, (res) => {
        res
          .on("data", (d) => {
            console.log(d.toString("utf-8"));
          })
          .on("error", (error) => {
            console.log(error.toString("utf-8"));
            retry.call(`${error}`);
          })
          .on("end", (d) => {
            resolver(req, resolve);
          });
      });

      req.write(JSON.stringify(config.config) || "");
      req.end();
    }
  });
}

export async function postConnectors(cluster, connectors, path) {
  var workerIps = await getWorkerIps(cluster);
  for (var i = 0; i < connectors.length; i++) {
    console.log(
      `Posting to connector with config: ${JSON.stringify(
        connectors[i],
        null,
        2
      )}`
    );
    //This won't account for multiple tasks with multiple interfaces
    await postConnector(workerIps[0], connectors[i], path);
  }
}

export async function restartConnectors(cluster, connectors) {
  console.log("Restarting connectors");
  var workerIps = await getWorkerIps(cluster);
  for (var i = 0; i < connectors.length; i++) {
    let connector = lodash.omit(connectors[i], "config");
    connector.tasks = connectors[i].config["tasks.max"];
    console.log(
      `Posting to connector with config: ${JSON.stringify(connector, null, 2)}`
    );
    //This won't account for multiple tasks with multiple interfaces
    await postConnector(workerIps[0], connector, "restart");
  }
}

export async function deleteConnector(ip, name) {
  return new Promise((resolve, reject) => {
    var retry = function (e) {
      console.log("Got error: " + e);
      setTimeout(async function () {
        return await deleteConnector(ip, name);
      }, 5000);
    };

    var options = {
      hostname: ip,
      port: 8083,
      path: `/connectors/${name}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const req = http.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      res
        .on("data", (d) => {
          console.log(d.toString("utf-8"));
          if (JSON.parse(d).message != `Connector ${name} not found`) {
            return retry.call(d.toString("utf-8"));
          }
        })
        .on("error", (error) => {
          return retry.call(`${error}`);
        })
        .on("end", (d) => {
          resolver(req, resolve);
        });
    });
    req.write(JSON.stringify({}));
    req.end();
  });
}

export async function deleteConnectors(cluster, connectors) {
  var workerIps = await getWorkerIps(cluster);
  for (var i = 0; i < connectors.length; i++) {
    console.log(`Deleting connector: ${connectors[i]}`);
    //This won't account for multiple tasks with multiple interfaces
    await deleteConnector(workerIps[0], connectors[i]);
  }
}

export async function testConnector(ip, config) {
  return new Promise((resolve, reject) => {
    var options = {
      hostname: ip,
      port: 8083,
      path: `/connectors/${config.name}/status`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("Test Kafka-connect service", options);
    const req = http.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      res
        .on("data", (d) => {
          console.log(d.toString("utf-8"));
          var data = JSON.parse(d);
          if (data.connector.state != "RUNNING") {
            throw new Error(
              `Expected ${data.name} state to be RUNNING, saw state ${data.connector.state}`
            );
          }
        })
        .on("error", (error) => {
          console.log(error);
        })
        .on("end", (d) => {
          resolver(req, resolve);
        });
    });

    req.write(JSON.stringify({}));
    req.end();
  });
}

export async function testConnectors(cluster, connectors) {
  var workerIps = await getWorkerIps(cluster);
  for (var i = 0; i < connectors.length; i++) {
    console.log(`Testing connector: ${connectors[i].name}`);
    //This won't account for multiple tasks with multiple interfaces
    await testConnector(workerIps[0], connectors[i]);
  }
}
