import { GalreeConfig } from './galreeConfig.ts';
import { stringify } from '@std/toml';

type VirtualHostConfig = {
	host: string;
	root: string;
};

export function generateSWSTomlConfig(
	galreeConfig: GalreeConfig,
	dev: boolean,
): string {
	const SWCConfig = {
		'general': {
			'host': '::',
			'port': 80,
			'root': './galree',
			'log-level': dev ? 'debug' : 'error',
			'cache-control-headers': true,
			'compression': true,
			'compression-level': 'default',
			// Note: If a relative path is used then it will be resolved under the root directory.
			'page404': '/404.html',
			'page50x': '/50x.html',
			'http2': false,
			// "http2-tls-cert": "",
			// "http2-tls-key": "",
			// "https-redirect": False,
			// "https-redirect-host": "localhost",
			// "https-redirect-from-port": 80,
			// "https-redirect-from-hosts": "localhost",
			'directory-listing': false,
			'threads-multiplier': 2,
			'grace-period': 0,
			'log-remote-address': false,
			'redirect-trailing-slash': true,
			'compression-static': true,
			'health': false,
			'maintenance-mode': false,
		},
		'advanced': {
			'redirects': [{
				'source': '/index.html',
				'destination': '/',
				'kind': 301,
			}, {
				'source': '/admin/index.html',
				'destination': '/admin',
				'kind': 301,
			}],

			//
			// rewrites
			// every route managed by the front app must be rewriten to avoid 404
			//
			'rewrites': [{
				'source': '/artwork/*',
				'destination': '/',
			}, {
				'source': '/presentation',
				'destination': '/',
			}],
			'virtual-hosts': [] as VirtualHostConfig[],
		},
	};

	for (const [siteId, siteConfig] of Object.entries(galreeConfig.sites)) {
		let host = siteConfig.subdomain + '.' + galreeConfig.defaultCodomain;
		if (dev) {
			host += ':8080';
		}
		SWCConfig.advanced['virtual-hosts'].push({
			host,
			root: `/galree/sites/${siteId}`,
		});
	}

	return stringify(SWCConfig);
}
