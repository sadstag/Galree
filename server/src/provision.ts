import { die, info, stepBegins, stepEnds } from './lib/feedback.ts';
import { readConfig } from './readConfig.ts';

import { Storage } from 'npm:@google-cloud/storage';
import {
	createBucket,
	listBuckets,
	setBucketCORS,
	setBucketPermissions,
	SiteAdminMapping,
} from './lib/GCP/bucket.ts';
import { StorageControlClient } from 'npm:@google-cloud/storage-control';
import { ARTWORKS_FOLDER_NAME } from './const.ts';

async function main() {
	info('----------------------------------------------------');
	info('Provisioning and configuring GCP resources for sites');
	info('----------------------------------------------------');

	//
	// 1 - reading galree config
	//
	const {
		GCPProjectId: projectId,
		sites: siteConfigs,
		domain,
		public_bucket,
	} = await readConfig();

	const storage = new Storage({ projectId });
	const controlClient = new StorageControlClient();

	//
	// 2 - Ensuring public bucket exists
	//
	stepBegins('Ensuring public bucket exists');
	const buckets = await listBuckets(storage);

	if (buckets.some((b) => b.name === public_bucket)) {
		stepEnds(
			'Bucket "' + public_bucket +
				'" already exists, skipping creation',
		);
	} else {
		try {
			await createBucket(
				public_bucket,
				storage,
			),
				stepEnds(
					`Created bucket "${public_bucket}"`,
				);
		} catch (e) {
			die(
				"Could not create bucket '" + public_bucket + "': " +
					(e as Error).message,
			);
		}
	}

	info('');

	//
	// 5 - Settings CORS for pubolic bucket
	//
	for (
		const { subdomain } of Object.values(
			siteConfigs,
		)
	) {
		const corsOrigin = 'http://' + domain + '.' + subdomain;

		stepBegins('Ensuring CORS for bucket: ' + public_bucket);
		try {
			await setBucketCORS(public_bucket, storage, [corsOrigin]);
			stepEnds(
				`Successfully set CORS for bucket "${public_bucket}"`,
			);
		} catch (e) {
			die(
				"Could not set CORS for bucket '" +
					public_bucket + "': " +
					(e as Error).message,
			);
		}
	}

	//
	// 6- Setting permissions for public bucket
	//
	const siteAdminGoogleAccounts: SiteAdminMapping = Object.values(siteConfigs)
		.map(
			(
				{ siteId, siteAdminGoogleAccount },
			) => [siteId, siteAdminGoogleAccount],
		);

	stepBegins('Ensuring permissions for bucket: "' + public_bucket + '"');
	try {
		await setBucketPermissions(
			public_bucket,
			storage,
			controlClient,
			siteAdminGoogleAccounts,
			ARTWORKS_FOLDER_NAME,
		);
		stepEnds(
			`Successfully set permissions for bucket: "${public_bucket}"`,
		);
	} catch (e) {
		die(
			"Could not set permissions for bucket '" +
				public_bucket + "': " +
				(e as Error).message,
		);
	}

	//
	// N - Warning for all existing buckets that are not site bucketd
	//
}

await main();
