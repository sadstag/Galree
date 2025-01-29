import { getAccessToken } from './auth.ts';

export async function getIAMPolicyForFolder(
	bucketName: string,
	folder: string,
): Promise<unknown[]> {
	const accessToken = getAccessToken();
	const url = buildManagedFolderIAMURL(bucketName, folder);

	const response = await fetch(
		url,
		{ headers: { 'Authorization': 'Bearer ' + accessToken } },
	);
	if (!response.ok) {
		const data = await response.text();
		throw Error(
			'Could not get IAM policy for folder "' + folder +
				'": HTTP status ' + response.status +
				'\n' + data,
		);
	}
	const data = await response.json();
	return data.bindings ?? [];
}

export async function setIAMPolicyForFolder(
	bucketName: string,
	folder: string,
	bindings: unknown[],
): Promise<void> {
	const accessToken = getAccessToken();
	const url = buildManagedFolderIAMURL(bucketName, folder);
	const body = JSON.stringify({ bindings });

	const response = await fetch(
		url,
		{
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + accessToken,
				'Content-Type': 'application/json',
			},
			body,
		},
	);
	if (!response.ok) {
		const data = await response.text();
		throw Error(
			'Could not set IAM policy for folder "' + folder +
				'": HTTP status ' + response.status +
				'\n' + data,
		);
	}
}

function buildManagedFolderIAMURL(bucketName: string, folder: string) {
	return 'https://storage.googleapis.com/storage/v1/b/' +
		encodeURIComponent(bucketName) +
		'/managedFolders/' + encodeURIComponent(folder) + '/iam';
}

export type RoleBinding = {
	role: string;
	members: string[];
};

export function roleBindingsRepresentation(bindings: RoleBinding[]): string {
	return bindings.reduce<string>(
		(acc, binding) =>
			acc + '\trole "' + binding.role + '" for ' +
			binding.members.join(', ') + '\n',
		'',
	);
}
