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
    this.serverless.cli.log(
      `Preparing online development mode for function ${this.options.function}...`
    );
    this.serverless.service.package.individually = false;
    await this.serverless.pluginManager.spawn("deploy:function");

    this.serverless.cli.log(
      `Function ${this.options.function} deployed successfully.  Watching for changes...`
    );

    var watcher = chokidar.watch(".", {
      ignored: ["node_modules", ".webpack", ".serverless"],
      awaitWriteFinish: true,
      ignoreInitial: true,
    });
    watcher.on("all", async (event, path) => {
      this.serverless.cli.log(
        `'${event}' event detected for ${path}.  Redeploying...`
      );
      delete this.serverless.service.custom.webpack;
      try {
        await this.serverless.pluginManager.spawn("deploy:function");
      } catch (error) {
        console.error(error);
        this.serverless.cli.log(
          `Error during deploy function command.  See above.`
        );
      }
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
    this.serverless.cli.log(`Halting serverless-online`);

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
    this.serverless.cli.log(`Got ${command} signal. Online Halting...`);
  }
}

module.exports = ServerlessPlugin;
