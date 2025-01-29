import { Bucket, Storage } from 'npm:@google-cloud/storage';
import { StorageControlClient } from '@google-cloud/storage-control';
import { info } from '../feedback.ts';
import {
	getIAMPolicyForFolder,
	RoleBinding,
	roleBindingsRepresentation,
	setIAMPolicyForFolder,
} from './iam.ts';

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
			hierarchicalNamespace: {
				enabled: true,
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

export type SiteAdminMapping = [
	siteId: string,
	siteAdminGoogleAccount: string,
][];

export async function setBucketPermissions(
	bucketName: string,
	storage: Storage,
	controlClient: StorageControlClient,
	siteAdminGoogleAccounts: SiteAdminMapping,
	artworksFolderName: string,
) {
	const bucket = storage.bucket(bucketName);

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
				role: 'roles/storage.folderAdmin',
				members: ['projectOwner:' + storage.projectId],
			},
		],
	});

	// tracing bucket policy
	const [{ bindings: resultingBindings }] = await bucket.iam.getPolicy({
		userProject: storage.projectId,
	});
	info(
		'Public bucket has role bindings:\n' +
			roleBindingsRepresentation(resultingBindings),
	);

	// one folder per site
	const bucketPath = controlClient.bucketPath('_', bucketName);
	let response = await controlClient.listManagedFolders({
		parent: bucketPath,
	});
	let folders = response[0];

	let someSiteFolderCreated = false;
	for (const [siteId] of siteAdminGoogleAccounts) {
		if (folders.some((folder) => folder.name?.split('/')[5] === siteId)) {
			info('Folder "' + siteId + '" already exists');
			continue;
		}

		// create site folder
		try {
			await controlClient.createManagedFolder({
				parent: bucketPath,
				managedFolderId: siteId,
			});
			someSiteFolderCreated = true;
			info('Created folder "' + siteId + '"');
		} catch (e) {
			throw Error(
				"Could not create folder '" + siteId + "': " +
					(e as Error).message,
			);
		}

		// create artworks folder in site folder
		try {
			await controlClient.createFolder({
				parent: bucketPath,
				folderId: siteId + '/' + artworksFolderName,
			});
			info(
				'Created folder "' + siteId + '/"' +
					artworksFolderName,
			);
		} catch (e) {
			throw Error(
				"Could not create folder '" + siteId + '/' +
					artworksFolderName + "': " +
					(e as Error).message,
			);
		}
	}

	info('');

	if (someSiteFolderCreated) {
		response = await controlClient.listManagedFolders({
			parent: bucketPath,
		});
		folders = response[0];
	}

	for (const [siteId, siteAdminGoogleAccount] of siteAdminGoogleAccounts) {
		// assigning permissions
		const folder = folders.find((folder) =>
			folder.name?.split('/')[5] === siteId
		);
		if (!folder) {
			throw Error(
				'Could not find folder for "' + siteId +
					'" after creation phase',
			);
		}

		const bindings = await getIAMPolicyForFolder(bucketName, siteId);

		await setIAMPolicyForFolder(
			bucketName,
			siteId,
			[...bindings, {
				'role': 'roles/storage.objectUser',
				'members': [
					'user:' + siteAdminGoogleAccount,
				],
			}],
		);

		// checking permissions and logging
		const bindingsNow = await getIAMPolicyForFolder(
			bucketName,
			siteId,
		) as unknown as RoleBinding[];
		info(
			'Folder "' + siteId + '" has role role bindings:\n' +
				roleBindingsRepresentation(bindingsNow),
		);
	}
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
