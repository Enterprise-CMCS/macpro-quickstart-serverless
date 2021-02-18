import { spawn } from "child_process";

// LabeledProcessRunner is a command runner that interleaves the output from different
// calls to run_command_and_output each with their own prefix
export default class LabeledProcessRunner {
  private prefixColors: Record<string, string> = {};
  private colors = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ];

  // formattedPrefix pads the prefix for a given process so that all prefixes are
  // right aligned in your terminal.
  private formattedPrefix(prefix: string): string {
    let color: string;

    if (prefix! in this.prefixColors) {
      color = this.prefixColors[prefix];
    } else {
      const frontColor = this.colors.shift();
      if (frontColor != undefined) {
        color = frontColor;
        this.colors.push(color);
        this.prefixColors[prefix] = color;
      } else {
        throw "dev.ts programming error";
      }
    }

    let maxLength = 0;
    for (let pre in this.prefixColors) {
      if (pre.length > maxLength) {
        maxLength = pre.length;
      }
    }

    return `\x1b[38;5;${color}m ${prefix.padStart(maxLength)}|\x1b[0m`;
  }

  // run_command_and_output runs the given shell command and interleaves its output with all
  // other commands run via this method.
  //
  // prefix: the prefix to display at the start of every line printed by this command
  // cmd: an array containing the command and all arguments to the command to be run
  // cwd: optional directory to change into before running the command
  // returns a promise that errors if the command exits error and resolves on success
  async run_command_and_output(
    prefix: string,
    cmd: string[],
    cwd: string | null
  ) {
    const proc_opts: Record<string, any> = {};

    if (cwd) {
      proc_opts["cwd"] = cwd;
    }

    const command = cmd[0];
    const args = cmd.slice(1);

    const proc = spawn(command, args, proc_opts);
    const startingPrefix = this.formattedPrefix(prefix);
    process.stdout.write(`${startingPrefix} Running: ${cmd.join(" ")}\n`);

    proc.stdout.on("data", (data) => {
      const paddedPrefix = this.formattedPrefix(prefix);

      for (let line of data.toString().split("\n")) {
        process.stdout.write(`${paddedPrefix} ${line}\n`);
      }
    });

    proc.stderr.on("data", (data) => {
      const paddedPrefix = this.formattedPrefix(prefix);

      for (let line of data.toString().split("\n")) {
        process.stdout.write(`${paddedPrefix} ${line}\n`);
      }
    });

    return new Promise<void>((resolve, reject) => {
      proc.on("error", (error) => {
        const paddedPrefix = this.formattedPrefix(prefix);
        process.stdout.write(`${paddedPrefix} A PROCESS ERROR: ${error}\n`);
        reject(error);
      });

      proc.on("close", (code) => {
        const paddedPrefix = this.formattedPrefix(prefix);
        process.stdout.write(`${paddedPrefix} Exit: ${code}\n`);
        resolve();
      });
    });
  }
}
