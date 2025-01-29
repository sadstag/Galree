import { parse } from '@std/jsonc';

export type GalreeConfig = {
	GCPProjectId: string;
	domain: string;
	public_bucket: string;
	sites: {
		[key: string]: SiteConfig;
	};
};

export type SiteConfig = {
	siteId: string;
	title: string;
	siteAdminGoogleAccount: string;
	googleSheetId: string;
	subdomain: string;
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
	if (!isRecord(config)) {
		return {
			isValid: false,
			error: 'Config must be an object',
		};
	}

	ensureNonEmptyStringField(config, 'GCPProjectId');
	ensureNonEmptyStringField(config, 'domain');
	ensureNonEmptyStringField(config, 'public_bucket');

	if (
		!('sites' in config && isRecord(config['sites']) &&
			Object.entries(config['sites']).length > 0)
	) {
		return {
			isValid: false,
			error: 'Missing field "sites" or not an object or empty',
		};
	}

	for (
		const [siteId, siteConfig] of Object.entries(
			config['sites'] as Record<string, unknown>,
		)
	) {
		const validationResult = validateSiteConfig(siteId, siteConfig);
		if (!validationResult.isValid) {
			return {
				isValid: false,
				error: 'Site "' + siteId + '": ' + validationResult.error,
			};
		}
		config['sites'][siteId] = validationResult.config;
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
	siteId: string,
	siteConfig: unknown,
): ValidationResult<SiteConfig> {
	if (!isRecord(siteConfig)) {
		return {
			isValid: false,
			error: 'some site config is not an object',
		};
	}

	ensureNonEmptyStringField(siteConfig, 'title');
	ensureNonEmptyStringField(siteConfig, 'siteAdminGoogleAccount');
	ensureNonEmptyStringField(siteConfig, 'googleSheetId');
	ensureNonEmptyStringField(siteConfig, 'subdomain');

	return {
		isValid: true,
		config: { ...siteConfig, siteId } as SiteConfig,
	};
}

function isRecord(tested: unknown): tested is Record<string, unknown> {
	return typeof tested === 'object' && tested !== null;
}

function ensureNonEmptyStringField(
	object: Record<string, unknown>,
	fieldName: string,
) {
	if (
		!(fieldName in object &&
			typeof object[fieldName] === 'string' &&
			object[fieldName].length > 0)
	) {
		throw Error(
			'missing field "googleSheetId" or not string-valued or empty',
		);
	}
}
