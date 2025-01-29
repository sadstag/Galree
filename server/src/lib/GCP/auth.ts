let accessToken: string = '';

export function getAccessToken(): string {
	if (accessToken) {
		return accessToken;
	}
	const command = new Deno.Command('gcloud', {
		args: [
			'auth',
			'print-access-token',
		],
	});
	const { code, stdout, stderr } = command.outputSync();
	if (code === 0) {
		accessToken = (new TextDecoder().decode(stdout)).split('\n')[0];
		return accessToken;
	} else {
		throw Error(
			'Could not get access token from gcloud CLI : ' +
				new TextDecoder().decode(stderr),
		);
	}
}
