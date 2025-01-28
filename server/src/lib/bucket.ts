import { Bucket, Storage } from 'npm:@google-cloud/storage';

/**
 * Returns a function that generates a bucket name for a given site.
 *
 * @param prefix - The prefix to be used for the bucket name, a bucket name is unique in all GCP space, you can use the projectId to be prettry confident in uniqueness here
 * @returns A function that takes a siteId and returns the full bucket name.
 */
export const bucketNameBuilderFactory = (prefix: string) => (siteId: string) =>
	prefix + '-' + siteId;

export async function listBuckets(storage: Storage): Promise<Bucket[]> {
	const [buckets] = await storage.getBuckets();
	return buckets;
}

export async function createBucket(
	name: string,
	storage: Storage,
): Promise<Bucket> {
	const { projectId } = storage;
	try {
		const response = await storage.createBucket(name, {
			regional: true,
			userProject: projectId,
			location: 'EUROPE-WEST9',
			iamConfiguration: {
				uniformBucketLevelAccess: {
					enabled: true,
				},
			},
		});
		return response[0];
	} catch (e) {
		throw Error(
			"Could not create bucket '" + name + "': " +
				(e as Error).message,
		);
	}
}

export async function setBucketPermissions(
	name: string,
	storage: Storage,
	siteAdminGoogleAccount: string,
) {
	const bucket = storage.bucket(name);

	const [{ bindings }] = await bucket.iam.getPolicy({
		userProject: storage.projectId,
	});

	await bucket.iam.setPolicy({
		bindings: [
			...bindings,
			{
				role: 'roles/storage.objectViewer',
				members: ['allUsers'],
			},
			{
				role: 'roles/storage.objectUser',
				members: [
					'user:' + siteAdminGoogleAccount,
				],
			},
		],
	});
}

export async function setBucketCORS(
	name: string,
	storage: Storage,
	corsOrigin: string[],
) {
	const bucket = storage.bucket(name);

	await bucket.setCorsConfiguration([{
		maxAgeSeconds: 60 * 60 * 24,
		method: ['GET'],
		origin: corsOrigin,
		responseHeader: ['Content-Type'],
	}]);
}
