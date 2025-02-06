import { useAccessToken } from "../../../AccesstokenProvider";
import { getGalreeConfig } from "../../../config";
import { listObjects, postObject } from "../../../google/storage";

const ImagesPage = () => {
	const config = getGalreeConfig();
	const accessToken = useAccessToken();

	const handleListClick = async () => {
		const bucketObjects = await listObjects(
			config.bucket,
			config.siteId,
			accessToken()?.accessToken!,
		);
		console.log({ bucketObjects });
	};

	const handlePutClick = async () => {
		const response = await postObject(
			config.bucket,
			`${config.siteId}/${Math.ceil(Math.random() * 10000)}.txt`,
			accessToken()?.accessToken!,
		);
		console.log({ putObjectResponse: response });
	};
	return (
		<>
			<h1>Images</h1>
			<button type="button" onClick={handleListClick}>
				List bucket
			</button>
			<br />
			<button type="button" onClick={handlePutClick}>
				Put random object
			</button>
		</>
	);
};

export default ImagesPage;
