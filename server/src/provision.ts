import { die, info, stepBegins, stepEnds } from './lib/feedback.ts';
import { readConfig } from './readConfig.ts';

import { Storage } from 'npm:@google-cloud/storage';
import {
	bucketNameBuilderFactory,
	createBucket,
	listBuckets,
	setBucketCORS,
	setBucketPermissions,
} from './lib/bucket.ts';

async function main() {
	info('----------------------------------------------------');
	info('Provisioning and configuring GCP resources for sites');
	info('----------------------------------------------------');

	//
	// 1 - reading galree config
	//
	const { GCPProjectId: projectId, sites: siteConfigs, domain } =
		await readConfig();
	const bucketNameBuilder = bucketNameBuilderFactory(projectId);

	const storage = new Storage({ projectId });

	//
	// 2 - listing existing buckets
	//
	stepBegins('Listing existing buckets ...');
	let existingBuckets = await listBuckets(storage);
	for (const { name } of existingBuckets) {
		info(`\t${name}`);
	}
	stepEnds('Listed existed buckets.');

	//
	// 3 - Listing all galree site buckets
	//
	stepBegins('Listing needed galree site buckets ...');
	const siteBuckets = Object.values(siteConfigs).map(({ siteId }) =>
		bucketNameBuilder(siteId)
	);
	for (const name of siteBuckets) {
		info(`\t${name}`);
	}
	stepEnds('Listed needed galree site buckets.');

	//
	// 4 - Creating missing buckets
	//
	let nbCreatedBuckets = 0;
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

		stepBegins(`Creating missing bucket ${name} ...`);

		try {
			existingBuckets.push(
				await createBucket(
					bucketName,
					storage,
				),
			);
			nbCreatedBuckets++;
			stepEnds(
				`Created bucket: ${bucketName}`,
			);
		} catch (e) {
			die(
				"Could not create bucket '" + bucketName + "': " +
					(e as Error).message,
			);
		}
	}

	if (nbCreatedBuckets === 0) {
		info('No new bucket created');
	} else {
		info('Created ' + nbCreatedBuckets + ' new bucket(s)');
		// re-fetching bucket list after creations
		existingBuckets = await listBuckets(storage);
		info('now buckets are :');
		for (const { name } of existingBuckets) {
			info(`\t${name}`);
		}
	}

	console.log('');

	//
	// 5 - Settings CORS for site buckets
	//
	for (
		const { siteId, subdomain } of Object.values(
			siteConfigs,
		)
	) {
		const bucketName = bucketNameBuilder(siteId);
		const corsOrigin = 'http://' + domain + '.' + subdomain;

		stepBegins('Ensuring CORS for bucket: ' + bucketName);
		try {
			await setBucketCORS(bucketName, storage, [corsOrigin]);
			stepEnds(
				`Successfully set CORS for bucket: ${bucketName}`,
			);
		} catch (e) {
			die(
				"Could not set CORS for bucket '" +
					bucketName + "': " +
					(e as Error).message,
			);
		}
	}

	//
	// 6- Setting permissions for site buckets
	//
	for (
		const { siteId, siteAdminGoogleAccount } of Object.values(
			siteConfigs,
		)
	) {
		const bucketName = bucketNameBuilder(siteId);

		stepBegins('Ensuring permissions for bucket: ' + bucketName);
		try {
			setBucketPermissions(bucketName, storage, siteAdminGoogleAccount);
			stepEnds(
				`Successfully set permissions for bucket: ${bucketName}`,
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
