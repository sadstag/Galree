import { getDockerImageName } from './const.ts';
import { error, info, stepBegins, stepEnds, success } from './lib/feedback.ts';
import { GalreeConfig } from './lib/galreeConfig.ts';
import { readConfig } from './readConfig.ts';

const CONTAINER_NAME = 'galree-dev';

function deleteContainer() {
	stepBegins('Deleting existing container ...');
	const command = new Deno.Command('docker', {
		args: ['rm', '-f', CONTAINER_NAME],
	});
	const { code, stdout, stderr } = command.outputSync();
	if (code !== 0) {
		info(new TextDecoder().decode(stdout));
		error(new TextDecoder().decode(stderr));
	} else {
		stepEnds('Deleted existing container');
	}
}

function startContainer(config: GalreeConfig) {
	stepBegins('Running docker image ...');
	const command = new Deno.Command('docker', {
		args: [
			'run',
			'--name',
			'galree-dev',
			'--publish',
			'8080:80',
			'--detach',
			getDockerImageName(true),
		],
	});
	const { code, stdout, stderr } = command.outputSync();
	if (code === 0) {
		let message = 'Docker image is running, on all the following URLs :\n';
		for (const siteConfig of Object.values(config.sites)) {
			message += '\thttp://' + siteConfig.subdomain + '.' +
				config.defaultCodomain + ':8080\n';
			message += '\thttp://' + siteConfig.subdomain + '.' +
				config.defaultCodomain + ':8080/admin\n';
		}
		stepEnds(message);
	} else {
		info(new TextDecoder().decode(stdout));
		error(new TextDecoder().decode(stderr));
	}
}

async function main() {
	const config = await readConfig();
	deleteContainer();
	startContainer(config);
}

await main();
