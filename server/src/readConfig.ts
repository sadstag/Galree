import { CONFIG_FILE } from './const.ts';
import { die, info, success } from './lib/feedback.ts';
import { GalreeConfig, readGalreeConfigFromFile } from './lib/galreeConfig.ts';

export async function readConfig(): Promise<GalreeConfig> {
	info('Parsing ' + CONFIG_FILE + ' ...');
	let config: GalreeConfig;
	try {
		config = await readGalreeConfigFromFile(CONFIG_FILE);
		success('Parsed ' + CONFIG_FILE);
		return config;
	} catch (e) {
		die((e as Error).message);
		throw Error(); // just for TS to understand we wont return undefined
	}
}
