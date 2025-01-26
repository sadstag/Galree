import { getDockerIlmageName } from './const.ts';
import { error, info, success } from './lib/feedback.ts';
import { readConfig } from './readConfig.ts';

async function main() {
	const config = await readConfig();

	info('Running docker image ...');
	const command = new Deno.Command('docker', {
		args: [
			'run',
			'--rm',
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
		}
	} else {
		info(new TextDecoder().decode(stdout));
		error(new TextDecoder().decode(stderr));
	}
}

await main();
