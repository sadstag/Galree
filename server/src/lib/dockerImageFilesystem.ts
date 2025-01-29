import { SiteConfig } from './galreeConfig.ts';
import { Eta } from 'jsr:@eta-dev/eta';

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
		Deno.mkdirSync(folderPath + '/galree/sites', { recursive: true });
	} catch (e) {
		throw Error(
			'Could not create temp directory (' + folderPath + '/galree/sites' +
				'): ' + (e as Error).message,
		);
	}

	try {
		Deno.mkdirSync(folderPath + '/galree/common/public/assets', {
			recursive: true,
		});
	} catch (e) {
		throw Error(
			'Could not create public assets directory (' + folderPath +
				'/galree/common/public/assets' +
				'): ' + (e as Error).message,
		);
	}

	try {
		Deno.mkdirSync(folderPath + '/galree/common/admin/assets', {
			recursive: true,
		});
	} catch (e) {
		throw Error(
			'Could not create admin assets directory (' + folderPath +
				'/galree/common/admin/assets' +
				'): ' + (e as Error).message,
		);
	}

	Deno.copyFileSync('const_files/404.html', folderPath + '/404.html');
	Deno.copyFileSync('const_files/50x.html', folderPath + '/50x.html');

	Deno.copyFileSync(
		'const_files/test_public_asset.png',
		folderPath + '/galree/common/public/assets/test_public_asset.png',
	);
	Deno.copyFileSync(
		'const_files/test_admin_asset.png',
		folderPath + '/galree/common/admin/assets/test_admin_asset.png',
	);
}

export function createSiteFolder(dockerFSFolderPath: string, siteId: string) {
	const siteFolderpath = dockerFSFolderPath + '/galree/sites/' + siteId;
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
			'../../common/public/assets',
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
			'../../common/admin/assets',
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

	const destFilepath = dockerFSFolderPath + '/galree/sites/' + siteId +
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

	const html = templateRenderer.renderString(HTMLTemplate, {
		siteId,
		title,
		config: 'window.galree = ' +
			JSON.stringify({ siteId, siteAdminGoogleAccount, googleSheetId }),
	});

	const destFilepath = dockerFSFolderPath + '/galree/sites/' + siteId +
		'/admin/index.html';

	Deno.writeFileSync(destFilepath, encoder.encode(html));
}
