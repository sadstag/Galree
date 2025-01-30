import { randomInt } from 'node:crypto';
import {
	ADMIN_FRONT_ASSETS_FOLDER,
	PUBLIC_FRONT_ASSETS_FOLDER,
} from '../const.ts';
import { SiteConfig } from './galreeConfig.ts';
import { Eta } from 'jsr:@eta-dev/eta';
const { createHash } = await import('node:crypto');

export function prepareTempDirectory(folderPath: string) {
	let folderExists = false;
	try {
		Deno.lstatSync(folderPath);
		folderExists = true;
	} catch (_) {
		// folder does not exist
	}

	if (folderExists) {
		try {
			Deno.removeSync(folderPath, { recursive: true });
		} catch (e) {
			throw Error(
				'Could not remove temp directory (' + folderPath +
					'): ' + (e as Error).message,
			);
		}
	}

	try {
		Deno.mkdirSync(folderPath + '/sites', { recursive: true });
	} catch (e) {
		throw Error(
			'Could not create temp directory (' + folderPath + '/sites' +
				'): ' + (e as Error).message,
		);
	}
	try {
		recursiveFolderCopy(
			PUBLIC_FRONT_ASSETS_FOLDER,
			folderPath + '/assets',
		);
	} catch (e) {
		throw Error(
			'Could not recursively copy folder ' + PUBLIC_FRONT_ASSETS_FOLDER +
				' to ' + folderPath + '/assets' +
				': ' + (e as Error).message,
		);
	}

	try {
		recursiveFolderCopy(
			ADMIN_FRONT_ASSETS_FOLDER,
			folderPath + '/admin_assets',
		);
	} catch (e) {
		throw Error(
			'Could not recursively copy folder ' + PUBLIC_FRONT_ASSETS_FOLDER +
				' to ' + folderPath + '/admin_assets' +
				': ' + (e as Error).message,
		);
	}

	Deno.copyFileSync('const_files/404.html', folderPath + '/404.html');
	Deno.copyFileSync('const_files/50x.html', folderPath + '/50x.html');
}

function recursiveFolderCopy(sourceFolder: string, destinationFolder: string) {
	Deno.mkdirSync(destinationFolder);
	for (const entry of Deno.readDirSync(sourceFolder)) {
		if (entry.isDirectory) {
			Deno.mkdirSync(destinationFolder + '/' + entry.name);
			recursiveFolderCopy(
				sourceFolder + '/' + entry.name,
				destinationFolder + '/' + entry.name,
			);
		} else {
			Deno.copyFileSync(
				sourceFolder + '/' + entry.name,
				destinationFolder + '/' + entry.name,
			);
		}
	}
}

export function createSiteFolder(dockerFSFolderPath: string, siteId: string) {
	const siteFolderpath = dockerFSFolderPath + '/sites/' + siteId;
	try {
		Deno.mkdirSync(siteFolderpath);
	} catch (e) {
		throw Error(
			'Could not create site folder (' + siteFolderpath +
				'): ' + (e as Error).message,
		);
	}
	try {
		Deno.mkdirSync(siteFolderpath + '/admin');
	} catch (e) {
		throw Error(
			'Could not create site folder (' + siteFolderpath +
				'/admin): ' + (e as Error).message,
		);
	}
	try {
		Deno.symlinkSync(
			'../../assets',
			siteFolderpath + '/assets',
		);
	} catch (e) {
		throw Error(
			'Could not create public assets symlink (' + siteFolderpath +
				'/assets): ' + (e as Error).message,
		);
	}

	try {
		Deno.symlinkSync(
			'../../admin_assets',
			siteFolderpath + '/admin_assets',
		);
	} catch (e) {
		throw Error(
			'Could not create admin assets symlink (' + siteFolderpath +
				'/admin_assets): ' + (e as Error).message,
		);
	}
}

export function createPublicSiteIndexFile(
	dockerFSFolderPath: string,
	publicFrontIndexHTMLFilepath: string,
	siteId: string,
	{ title }: SiteConfig,
) {
	const templateRenderer = new Eta();
	const decoder = new TextDecoder('UTF-8');
	const encoder = new TextEncoder();

	let HTMLTemplate;
	try {
		const data = Deno.readFileSync(
			publicFrontIndexHTMLFilepath,
		);
		HTMLTemplate = decoder.decode(data);
	} catch (e) {
		throw Error(
			'Could not read public front index file (' +
				publicFrontIndexHTMLFilepath + '): ' + (e as Error).message,
		);
	}

	const html = templateRenderer.renderString(HTMLTemplate, {
		siteId,
		title,
		config: 'window.galree = ' +
			JSON.stringify({ siteId }),
	});

	const destFilepath = dockerFSFolderPath + '/sites/' + siteId +
		'/index.html';

	Deno.writeFileSync(destFilepath, encoder.encode(html));
}

export function createAdminSiteIndexFile(
	dockerFSFolderPath: string,
	adminFrontIndexHTMLFilepath: string,
	siteId: string,
	{ title, siteAdminGoogleAccount, googleSheetId }: SiteConfig,
) {
	const templateRenderer = new Eta();
	const decoder = new TextDecoder('UTF-8');
	const encoder = new TextEncoder();

	let HTMLTemplate;
	try {
		const data = Deno.readFileSync(
			adminFrontIndexHTMLFilepath,
		);
		HTMLTemplate = decoder.decode(data);
	} catch (e) {
		throw Error(
			'Could not read admin front index file (' +
				adminFrontIndexHTMLFilepath + '): ' + (e as Error).message,
		);
	}

	const hashSalt = '' + randomInt(100000, 1000000);
	const hashed_siteAdminGoogleAccount = createHash('sha256', {})
		.update(siteAdminGoogleAccount + hashSalt).digest('hex');

	const html = templateRenderer.renderString(HTMLTemplate, {
		siteId,
		title,
		config: 'window.galree = ' +
			JSON.stringify({
				siteId,
				hashSalt,
				hashed_siteAdminGoogleAccount,
				googleSheetId,
			}),
	});

	const destFilepath = dockerFSFolderPath + '/sites/' + siteId +
		'/admin/index.html';

	Deno.writeFileSync(destFilepath, encoder.encode(html));
}
