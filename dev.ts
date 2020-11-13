import { spawn } from 'child_process'

console.log('Hello we devin');


async function run_db_locally(runner: LabeledProcessRunner) {

	await runner.run_command_and_output('dynamo yarn', ['yarn', 'install'], 'services/database')
	await runner.run_command_and_output('dynamo deps', ['serverless', 'dynamodb', 'install'], 'services/database')
	runner.run_command_and_output('dynamodb', ['serverless', '--stage', 'main', 'dynamodb', 'start', '--migrate'], 'services/database')

}

async function run_api_locally(runner: LabeledProcessRunner) {

	await runner.run_command_and_output('server yarn', ['yarn', 'install'], 'services/app-api')
	runner.run_command_and_output('serverless', ['serverless', '--stage', 'main', '--region', 'us-east-1', 'offline', '--httpPort', '3030', 'start'], 'services/app-api')
	
}

async function run_fe_locally(runner: LabeledProcessRunner) {

	await runner.run_command_and_output('fe deps', ['yarn', 'install'], 'services/ui-src')
	await runner.run_command_and_output('local conf', ['./configureLocal.sh', 'main'], 'services/ui-src')

	runner.run_command_and_output('frontend', ['npm', 'start'], 'services/ui-src')
	
}

class LabeledProcessRunner {
	private prefixColors: Record<string, string> = {}
	private colors = ['1', '2', '3', '4', '5', '6', '9', '10', '11', '12', '13', '14']

	private formattedPrefix(prefix: string): string {
		let color: string

		if (prefix !in this.prefixColors) {
			color = this.prefixColors[prefix]
		} else {
			const frontColor = this.colors.shift()
			if (frontColor != undefined) {
				color = frontColor
				this.colors.push(color)
				this.prefixColors[prefix] = color
			} else {
				console.log("BAD NEWS BEARS")
				throw('dev.ts programming error')
			}
		}

		let maxLength = 0
		for (let pre in this.prefixColors) {
			if (pre.length > maxLength) {
				maxLength = pre.length
			}
		}

		return `\x1b[38;5;${color}m|${prefix.padEnd(maxLength)}|\x1b[0m`
	}

	async run_command_and_output(prefix: string, cmd: string[], cwd: string | null) {

		const proc_opts: Record<string, any> = {}

		if (cwd) {
			proc_opts['cwd'] = cwd
		}

		proc_opts['env'] = Object.assign({}, process.env)

		// TODO: these should be set by a .env file
		proc_opts['env']['AWS_PROFILE'] = 'dev'
		proc_opts['env']['DYNAMODB_URL'] = 'http://localhost:8000'
		proc_opts['env']['API_URL'] = 'http://localhost:3030/main'

		const command = cmd[0]
		const args = cmd.slice(1)

		const fe_yarn = spawn(command, args, proc_opts)
		const startingPrefix = this.formattedPrefix(prefix)
		process.stdout.write(`${startingPrefix} Started\n`);

		fe_yarn.stdout.on('data', data => {
			const paddedPrefix = this.formattedPrefix(prefix)

			for (let line of data.toString().split('\n')) {
				process.stdout.write(`${paddedPrefix} ${line}\n`);
			}
		});

		fe_yarn.stderr.on('data', data => {
			const paddedPrefix = this.formattedPrefix(prefix)

			for (let line of data.toString().split('\n')) {
				process.stdout.write(`${paddedPrefix} ${line}\n`);
			}
		});

		return new Promise<void>((resolve, reject) => {
			const paddedPrefix = this.formattedPrefix(prefix)
			fe_yarn.on('error', (error) => {
				const paddedPrefix = this.formattedPrefix(prefix)
				process.stdout.write(`${paddedPrefix} AN ERROR: ${error}\n`)
				reject(error)
			})

			fe_yarn.on('close', code => {
				const paddedPrefix = this.formattedPrefix(prefix)
				process.stdout.write(`${paddedPrefix} Exiting: ${code}\n`);
				resolve()
			})
		})
	}

}

const runner = new LabeledProcessRunner()

run_db_locally(runner)
run_api_locally(runner)
run_fe_locally(runner)