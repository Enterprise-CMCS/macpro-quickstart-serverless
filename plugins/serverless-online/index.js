var chokidar = require("chokidar");

class ServerlessPlugin {
  constructor(serverless, cliOptions) {
    this.serverless = serverless;
    this.options = cliOptions;
    this.commands = {
      online: {
        usage: "Used for fast lambda development against AWS",
        commands: {
          start: {
            lifecycleEvents: ["init", "ready", "end"],
            options: {
              function: {
                usage:
                  "Specify the function you want to develop with serverless-online ",
                required: true,
                shortcut: "f",
              },
            },
          },
        },
        lifecycleEvents: ["start"],
      },
    };

    this.hooks = {
      "online:start:init": this.start.bind(this),
      "online:start:ready": this.ready.bind(this),
      "online:start": this._startWithExplicitEnd.bind(this),
      "online:start:end": this.end.bind(this),
    };
  }

  async start() {
    this.log(
      `Starting serverless-online development mode for function ${this.options.function}...`
    );

    // This plugin is not compatible with packaging individually.
    // While using this plugin, functions are packaged together.
    this.serverless.service.package.individually = false;

    // Initial 'deploy function' call.
    this.deployFunction();

    // Start streaming logs to the console.
    this.streamLogs();

    // Watch the service directory, and re 'deploy function' for any events.
    var watcher = chokidar.watch(".", {
      ignored: ["node_modules", ".webpack", ".serverless"],
      awaitWriteFinish: {
        stabilityThreshold: 200,
      },
      ignoreInitial: true,
    });
    watcher.on("all", async (event, path) => {
      this.log(`'${event}' event detected for ${path}.  Redeploying...`);
      this.deployFunction();
    });
  }

  async ready() {
    await this._listenForTermination();
  }

  async end(skipExit) {
    // TEMP FIXME
    if (process.env.NODE_ENV === "test" && skipExit === undefined) {
      return;
    }
    this.log(`Halting serverless-online`);

    const eventModules = [];

    if (!skipExit) {
      process.exit(0);
    }
  }

  async _startWithExplicitEnd() {
    await this.start();
    await this.ready();
    this.end();
  }

  async _listenForTermination() {
    const command = await new Promise((resolve) => {
      process
        // SIGINT will be usually sent when user presses ctrl+c
        .on("SIGINT", () => resolve("SIGINT"))
        // SIGTERM is a default termination signal in many cases,
        // for example when "killing" a subprocess spawned in node
        // with child_process methods
        .on("SIGTERM", () => resolve("SIGTERM"));
    });
    this.log(`Got ${command} signal. Online Halting...`);
  }

  async deployFunction() {
    delete this.serverless.service.custom.webpack;
    try {
      await this.serverless.pluginManager.spawn("deploy:function");
      this.log(
        `Function ${this.options.function} deployed successfully.  Watching for changes...`
      );
    } catch (error) {
      console.error(error);
      this.log(`Error during deploy function command.  See above.`);
    }
  }

  log(msg) {
    this.serverless.cli.log(`[SLS-ONLINE]:  ${msg}`);
  }

  async streamLogs() {
    this.options.tail = true;
    this.options.interval = 100;
    await this.serverless.pluginManager.spawn("logs");
  }
}

module.exports = ServerlessPlugin;
