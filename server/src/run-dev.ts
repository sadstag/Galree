import { getDockerIlmageName } from './const.ts';
import { error, info, success } from './lib/feedback.ts';
import { GalreeConfig } from './lib/galreeConfig.ts';
import { readConfig } from './readConfig.ts';

const CONTAINER_NAME = 'galree-dev';

function deleteContainer() {
	info('Deleting existing container ...');
	const command = new Deno.Command('docker', {
		args: ['rm', '-f', CONTAINER_NAME],
	});
	const { code, stdout, stderr } = command.outputSync();
	if (code !== 0) {
		info(new TextDecoder().decode(stdout));
		error(new TextDecoder().decode(stderr));
	} else {
		success('Deleted existing container');
	}
}

function startContainer(config: GalreeConfig) {
	info('Running docker image ...');
	const command = new Deno.Command('docker', {
		args: [
			'run',
			'--name',
			'galree-dev',
			'--publish',
			'8080:80',
			'--detach',
			getDockerIlmageName(true),
		],
	});
	const { code, stdout, stderr } = command.outputSync();
	if (code === 0) {
		success('Docker image is running');
		info('On all following URLs :');
		for (const siteConfig of Object.values(config.sites)) {
			info(
				'http://' + siteConfig.subdomain + '.' +
					config.defaultCodomain + ':8080',
			);
			info(
				'http://' + siteConfig.subdomain + '.' +
					config.defaultCodomain + ':8080/admin',
			);
		}
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
