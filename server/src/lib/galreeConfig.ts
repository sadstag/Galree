import { parse } from '@std/jsonc';

export type GalreeConfig = {
	defaultCodomain: string;
	sites: {
		[key: string]: SiteConfig;
	};
};

export type SiteConfig = {
	title: string;
	siteAdminGoogleAccount: string;
	googleSheetId: string;
	subdomain: string;
	online: boolean;
};

type ValidationResult<ConfigType> = {
	isValid: false;
	error: string;
} | {
	isValid: true;
	config: ConfigType;
};

export async function readGalreeConfigFromFile(
	filePath: string,
): Promise<GalreeConfig> {
	try {
		Deno.lstatSync(filePath);
	} catch (err) {
		if (!(err instanceof Deno.errors.NotFound)) {
			throw err;
		}
		throw Error('File ' + filePath + ' not found, please read the README');
	}

	const text = await Deno.readTextFile(filePath);

	let config;
	try {
		config = parse(text);
	} catch (_) {
		throw Error(
			'File ' + filePath + ' does not contain a valid JSON structure',
		);
	}

	const validationResult = validateGalreeConfig(config);

	if (!validationResult.isValid) {
		throw Error(
			'Error reading ' + filePath + ': ' + validationResult.error,
		);
	}

	return validationResult.config;
}

function validateGalreeConfig(
	config: unknown,
): ValidationResult<GalreeConfig> {
	if (typeof config !== 'object' || config === null) {
		return {
			isValid: false,
			error: 'Config must be an object',
		};
	}
	if (
		!('defaultCodomain' in config &&
			typeof config['defaultCodomain'] === 'string' &&
			config['defaultCodomain'].length > 0)
	) {
		return {
			isValid: false,
			error:
				'Missing field "defaultCodomain" or not string-valued or empty',
		};
	}
	if (
		!('sites' in config && typeof config['sites'] === 'object' &&
			config['sites'] !== null)
	) {
		return {
			isValid: false,
			error: 'Missing field "sites" or not an object',
		};
	}

	if (Object.entries(config['sites']).length === 0) {
		return {
			isValid: false,
			error: 'Field "sites" object is empty',
		};
	}

	for (
		const [siteId, siteConfig] of Object.entries(
			config['sites'] as Record<string, unknown>,
		)
	) {
		const validationResult = validateSiteConfig(siteConfig);
		if (!validationResult.isValid) {
			return {
				isValid: false,
				error: 'Site "' + siteId + '": ' + validationResult.error,
			};
		}
	}

	const galreeConfig = config as GalreeConfig;

	// checking that every subdomain is unique
	const subdomains = new Set<string>();
	for (const siteId in galreeConfig.sites) {
		if (subdomains.has(galreeConfig.sites[siteId].subdomain)) {
			return {
				isValid: false,
				error: 'Subdomain "' + galreeConfig.sites[siteId].subdomain +
					'" is used by several sites',
			};
		}
		subdomains.add(galreeConfig.sites[siteId].subdomain);
	}

	return {
		isValid: true,
		config: galreeConfig,
	};
}

export function validateSiteConfig(
	siteConfig: unknown,
): ValidationResult<SiteConfig> {
	if (!(typeof siteConfig === 'object') || siteConfig === null) {
		return {
			isValid: false,
			error: 'config is not an object',
		};
	}

	if (
		!('title' in siteConfig &&
			typeof siteConfig['title'] === 'string' &&
			siteConfig['title'].length > 0)
	) {
		return {
			isValid: false,
			error: 'missing field "title" or not string-valued or empty',
		};
	}

	if (
		!('siteAdminGoogleAccount' in siteConfig &&
			typeof siteConfig['siteAdminGoogleAccount'] === 'string')
	) {
		return {
			isValid: false,
			error:
				'missing field "siteAdminGoogleAccount" or not string-valued',
		};
	}

	if (
		!('googleSheetId' in siteConfig &&
			typeof siteConfig['googleSheetId'] === 'string' &&
			siteConfig['googleSheetId'].length > 0)
	) {
		return {
			isValid: false,
			error:
				'missing field "googleSheetId" or not string-valued or empty',
		};
	}

	if (
		!('subdomain' in siteConfig &&
			typeof siteConfig['subdomain'] === 'string')
	) {
		return {
			isValid: false,
			error: 'missing field "subdomain" or not string-valued',
		};
	}

	if (
		!('online' in siteConfig && typeof siteConfig['online'] === 'boolean')
	) {
		return {
			isValid: false,
			error: 'missing field "online" or not boolean-valued',
		};
	}

	return {
		isValid: true,
		config: siteConfig as SiteConfig,
	};
}
