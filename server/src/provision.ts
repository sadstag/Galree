import { die, info, success } from './lib/feedback.ts';
import { readConfig } from './readConfig.ts';

import { Storage } from 'npm:@google-cloud/storage';
import {
	bucketNameBuilderFactory,
	createBucket,
	listBuckets,
	setBucketPermissions,
} from './lib/bucket.ts';

async function main() {
	info('----------------------------------------------------');
	info('Provisioning and configuring GCP resources for sites');
	info('----------------------------------------------------');

	//
	// 1 - reading galree config
	//
	const { GCPProjectId: projectId, sites: siteConfigs, defaultCodomain } =
		await readConfig();
	const bucketNameBuilder = bucketNameBuilderFactory(projectId);

	const storage = new Storage({ projectId });

	//
	// 2 - listing existing buckets
	//
	info('Listing existing buckets ...');
	const existingBuckets = await listBuckets(storage);
	for (const { name } of existingBuckets) {
		info(`\t${name}`);
	}
	success('Listed existed buckets.');

	//
	// 3 - Listing all galree site buckets
	//
	info('Listing needed galree site buckets ...');
	const siteBuckets = Object.values(siteConfigs).map(({ siteId }) =>
		bucketNameBuilder(siteId)
	);
	for (const name of siteBuckets) {
		info(`\t${name}`);
	}
	success('Listed needed galree site buckets.');

	//
	// 4 - Creating missing buckets
	//
	for (
		const { siteId, subdomain } of Object.values(
			siteConfigs,
		)
	) {
		const bucketName = bucketNameBuilder(siteId);

		if (existingBuckets.some(({ name }) => name === bucketName)) {
			info(
				'Bucket "' + bucketName +
					'" already exists, skipping creation',
			);
			continue;
		}

		info(`Creating missing bucket ${name} ...`);

		const corsOrigin = 'http://' + defaultCodomain + '.' + subdomain;

		try {
			existingBuckets.push(
				await createBucket(
					bucketName,
					storage,
					[corsOrigin],
				),
			);
			success(
				`Created bucket: ${bucketName}`,
			);
		} catch (e) {
			die(
				"Could not create bucket '" + bucketName + "': " +
					(e as Error).message,
			);
		}
	}

	//
	// 5- Setting permissions for site buckets
	//
	for (
		const { siteId, siteAdminGoogleAccount } of Object.values(
			siteConfigs,
		)
	) {
		const bucketName = bucketNameBuilder(siteId);

		info('Ensuring permissions for bucket: ' + bucketName);
		try {
			setBucketPermissions(bucketName, storage, siteAdminGoogleAccount);
			success(
				`Successfully set permissions for bucket: ${name}`,
			);
		} catch (e) {
			die(
				"Could not set permissions for bucket '" +
					bucketName + "': " +
					(e as Error).message,
			);
		}
	}

	//
	// N - Warning for all existing buckets that are not site bucketd
	//
}

await main();
