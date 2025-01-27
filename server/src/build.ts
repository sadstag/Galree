import {
	ADMIN_FRONT_HTML_TEMPLATE_FILE,
	DOCKER_IMAGE_FILESYSTEM_TEMP_DIR,
	getDockerIlmageName,
	PUBLIC_FRONT_HTML_TEMPLATE_FILE,
} from './const.ts';
import { die } from './lib/die.ts';
import {
	createAdminSiteIndexFile,
	createPublicSiteIndexFile,
	createSiteFolder,
	prepareTempDirectory,
} from './lib/dockerImageFilesystem.ts';
import { error, info, success } from './lib/feedback.ts';
import { generateSWSTomlConfig } from './lib/SWSTomlConfig.ts';
import { parseArgs } from '@std/cli/parse-args';
import { readConfig } from './readConfig.ts';

async function main() {
	const { dev } = parseArgs(Deno.args, {
		boolean: ['dev'],
		default: {
			dev: false,
		},
	});

	const dockerImageName = getDockerIlmageName(dev);

	info('------------------------------------------------');
	info('Building docker image "' + dockerImageName + '"');
	info('------------------------------------------------');

	//
	// 1 - reading galree config
	//
	const config = await readConfig();

	//
	// 2 - creating server filesystem
	//
	info('Preparing temp directory');
	try {
		prepareTempDirectory(DOCKER_IMAGE_FILESYSTEM_TEMP_DIR);
	} catch (e) {
		die(
			'Error preparing docker filesystem temp directory: ' +
				(e as Error).message,
		);
	}
	success('Prepared temp directory');

	//
	// 3 - creating index.html for each galree site
	//
	info('Creating index.html files ...');
	for (const [siteId, siteConfig] of Object.entries(config.sites)) {
		try {
			createSiteFolder(DOCKER_IMAGE_FILESYSTEM_TEMP_DIR, siteId);
			createPublicSiteIndexFile(
				DOCKER_IMAGE_FILESYSTEM_TEMP_DIR,
				PUBLIC_FRONT_HTML_TEMPLATE_FILE,
				siteId,
				siteConfig,
			);
			createAdminSiteIndexFile(
				DOCKER_IMAGE_FILESYSTEM_TEMP_DIR,
				ADMIN_FRONT_HTML_TEMPLATE_FILE,
				siteId,
				siteConfig,
			);
		} catch (e) {
			die(
				'Error creating files for site ' + siteId + ': ' +
					(e as Error).message,
			);
		}
	}
	success('Created index.html files');

	//
	// 4 - generating SWS config
	//
	info('Generating SWS config ...');
	const SWCConfig = generateSWSTomlConfig(config, dev);
	try {
		Deno.writeFileSync(
			DOCKER_IMAGE_FILESYSTEM_TEMP_DIR + '/config.toml',
			new TextEncoder().encode(SWCConfig),
		);
	} catch (e) {
		die('Could not write config.toml file: ' + (e as Error).message);
	}
	success('Generated SWS config');

	//
	// 5 - Building docker image
	//
	info('Generating docker image ...');
	const command = new Deno.Command('docker', {
		args: [
			'build',
			'.',
			'-t',
			dockerImageName,
		],
	});
	const { code, stdout, stderr } = command.outputSync();
	if (code === 0) {
		success('Docker image is built');
	} else {
		info(new TextDecoder().decode(stdout));
		error(new TextDecoder().decode(stderr));
	}
}

await main();
